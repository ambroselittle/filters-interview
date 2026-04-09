import { useEffect } from "react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  BorrowerFieldName,
  BorrowerFields,
  FilterConditionSchema,
  OperatorsByType,
  type FilterCondition,
} from "shared";
import { FilterRow } from "./FilterRow";
import { UI } from "../labels";
import { useFilterStore } from "../store/filterStore";

const FormSchema = z.object({ conditions: z.array(FilterConditionSchema) });
type FilterFormValues = z.infer<typeof FormSchema>;

function defaultCondition(): FilterCondition {
  const field = BorrowerFieldName.FirstName;
  return { field, operator: OperatorsByType[BorrowerFields[field].type][0], value: "" };
}

export function FilterBar() {
  const { appliedFilters, setAppliedFilters } = useFilterStore();

  const methods = useForm<FilterFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: { conditions: appliedFilters },
  });

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "conditions",
  });

  // Keep the form in sync when filters are loaded from the URL or reset externally
  useEffect(() => {
    methods.reset({ conditions: appliedFilters });
  }, [appliedFilters, methods.reset]);

  const applyFilters = (data: FilterFormValues) => {
    methods.reset({ conditions: data.conditions });
    setAppliedFilters(data.conditions);
  };

  const onApply = methods.handleSubmit((data) => {
    if (!methods.formState.isDirty) return;
    const active = document.activeElement as HTMLElement | null;
    const name = active?.getAttribute("name") ?? "";
    applyFilters(data);
    // Restore focus after form reset — the DOM node may be replaced by useFieldArray,
    // so re-query by the input's name attribute.
    if (name) requestAnimationFrame(() => {
      (document.querySelector(`[name="${name}"]`) as HTMLElement | null)?.focus();
    });
  });

  const onAutoApply = () => {
    methods.handleSubmit(applyFilters)();
  };

  const onRemove = (index: number) => {
    const updated = methods.getValues("conditions").filter((_, i) => i !== index);
    remove(index);
    methods.reset({ conditions: updated });
    setAppliedFilters(updated);
  };

  const onClearAll = () => {
    methods.reset({ conditions: [] });
    setAppliedFilters([]);
  };

  const { isDirty } = methods.formState;
  const hasFilters = fields.length > 0 || appliedFilters.length > 0;

  return (
    <FormProvider {...methods}>
      <form onSubmit={onApply} className="border border-gray-300 rounded p-4 mb-4">
        <h2 className="font-semibold mb-3">{UI.filtersHeading}</h2>

        {fields.length === 0 && (
          <p className="text-sm text-gray-400 mb-3">{UI.emptyState}</p>
        )}

        {fields.map((field, index) => (
          <FilterRow
            key={field.id}
            index={index}
            onRemove={() => onRemove(index)}
            onAutoApply={onAutoApply}
          />
        ))}

        <div className="flex items-center justify-between mt-2">
          <button
            type="button"
            onClick={() => append(defaultCondition())}
            className="border border-gray-300 rounded px-3 py-1 text-sm hover:bg-gray-50"
          >
            {UI.addFilter}
          </button>

          {hasFilters && (
            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={!isDirty}
                className="bg-blue-600 text-white rounded px-3 py-1 text-sm
                           hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {UI.applyFilters}
              </button>
              <button
                type="button"
                onClick={onClearAll}
                className="border border-gray-300 rounded px-3 py-1 text-sm hover:bg-gray-50"
              >
                {UI.clearAll}
              </button>
            </div>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
