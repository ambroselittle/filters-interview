.PHONY: help init dev test build deploy deploy-api deploy-web clean

NVM_DIR := $(HOME)/.nvm
NVM     := . $(NVM_DIR)/nvm.sh

# Default target
.DEFAULT_GOAL := help

help: ## Show available commands
	@printf "\n\033[1mAvailable commands:\033[0m\n\n"
	@grep -E '^[a-zA-Z_-]+:.*## ' $(MAKEFILE_LIST) | \
		awk -F ':.*## ' '{ printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2 }'
	@printf "\n"

## ── Development ───────────────────────────────────────────────────────────────

init: ## Set up local dev environment end-to-end (nvm, deps, Postgres, schema, seed)
	@printf "\033[36m→ Installing Node %s via nvm...\033[0m\n" "$$(cat .nvmrc)"
	@$(NVM) && nvm install
	@printf "\033[36m→ Installing npm dependencies...\033[0m\n"
	@$(NVM) && nvm use && npm install
	@printf "\033[36m→ Copying .env files (skipping existing)...\033[0m\n"
	@if [ ! -f .env ]; then cp .env.example .env && printf "  created .env\n"; fi
	@if [ ! -f packages/server/.env ]; then cp packages/server/.env.example packages/server/.env && printf "  created packages/server/.env\n"; fi
	@printf "\033[36m→ Starting Postgres...\033[0m\n"
	@docker compose up -d postgres
	@printf "\033[36m→ Waiting for Postgres to be ready"
	@until docker compose exec postgres pg_isready -U postgres > /dev/null 2>&1; do \
		printf "."; sleep 1; \
	done
	@printf " ready.\033[0m\n"
	@printf "\033[36m→ Pushing Prisma schema to database...\033[0m\n"
	@$(NVM) && nvm use && npm run db:push
	@printf "\033[36m→ Seeding borrower data from borrowers.json...\033[0m\n"
	@$(NVM) && nvm use && npm run db:seed
	@printf "\n\033[32m✓ All set! Run 'make dev' to start.\033[0m\n\n"

dev: ## Start API server and client in watch mode
	@npm run dev

## ── Quality ───────────────────────────────────────────────────────────────────

test: ## Run all tests across packages (also used by CI)
	@printf "\033[36mRunning tests...\033[0m\n"
	@npm test

build: ## Build all packages (also validates types via tsc)
	@printf "\033[36mBuilding...\033[0m\n"
	@npm run build

## ── Deployment ────────────────────────────────────────────────────────────────

DEPLOY_CHECK = @[ -f .deploy-aws.json ] || { \
	printf "\033[31m✗ .deploy-aws.json not found.\033[0m\n"; \
	printf "  Run '/deploy-aws' in Claude Code first to provision AWS resources,\n"; \
	printf "  then use 'make deploy' for subsequent updates.\n"; \
	exit 1; \
}

deploy: deploy-api deploy-web ## Re-deploy both services to AWS
	@printf "\n\033[32m✓ Deployed! Check .deploy-aws.json for live URLs.\033[0m\n\n"

deploy-api: ## Build, push, and deploy only the API service
	$(DEPLOY_CHECK)
	@printf "\033[36m→ Building and pushing api image...\033[0m\n"
	@uv run --project ~/.claude/skills/deploy-aws \
		python ~/.claude/skills/deploy-aws/scripts/build-push.py --service api
	@printf "\033[36m→ Deploying api to App Runner...\033[0m\n"
	@uv run --project ~/.claude/skills/deploy-aws \
		python ~/.claude/skills/deploy-aws/scripts/deploy.py --service api

deploy-web: ## Build, push, and deploy only the web frontend
	$(DEPLOY_CHECK)
	@printf "\033[36m→ Building and pushing web image...\033[0m\n"
	@uv run --project ~/.claude/skills/deploy-aws \
		python ~/.claude/skills/deploy-aws/scripts/build-push.py --service web
	@printf "\033[36m→ Deploying web to App Runner...\033[0m\n"
	@uv run --project ~/.claude/skills/deploy-aws \
		python ~/.claude/skills/deploy-aws/scripts/deploy.py --service web

## ── Cleanup ───────────────────────────────────────────────────────────────────

clean: ## Stop and remove local Postgres container and volumes
	@docker compose down -v
	@printf "\033[32m✓ Postgres stopped and volumes removed.\033[0m\n"
