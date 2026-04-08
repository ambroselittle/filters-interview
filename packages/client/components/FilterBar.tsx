import { useEffect } from "react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  BorrowerFilterFields,
  FilterConditionSchema,
  type FieldMeta,
  type FilterableField,
  type FilterCondition,
} from "shared";
import { FilterRow } from "./FilterRow";
import { OperatorsByType, UI } from "../labels";
import { useFilterStore } from "../store/filterStore";

const FormSchema = z.object({ conditions: z.array(FilterConditionSchema) });
type FilterFormValues = z.infer<typeof FormSchema>;

// Phase 2: string fields only.
// Phase 3: remove the .filter() to expose number and date fields.
const filterableFields = (
  Object.entries(BorrowerFilterFields) as Array<[FilterableField, FieldMeta]>
).filter(([, meta]) => meta.type === "string");

function defaultCondition(): FilterCondition {
  const [field] = filterableFields[0];
  return { field, operator: OperatorsByType["string"][0], value: "" };
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

  const onApply = methods.handleSubmit((data) => {
    if (!methods.formState.isDirty) return;
    methods.reset({ conditions: data.conditions });
    setAppliedFilters(data.conditions);
  });

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
            fieldOptions={filterableFields}
            onRemove={() => onRemove(index)}
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
