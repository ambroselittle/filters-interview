import { useFormContext, Controller } from "react-hook-form";
import { BorrowerFilterFields, type FilterableField, type FilterCondition } from "shared";
import { OperatorLabels, OperatorsByType, UI } from "../labels";

type FilterFormValues = { conditions: FilterCondition[] };

type FilterRowProps = {
  index: number;
  fieldOptions: Array<[FilterableField, { label: string; type: string }]>;
  onRemove: () => void;
};

export function FilterRow({ index, fieldOptions, onRemove }: FilterRowProps) {
  const { control, setValue, watch } = useFormContext<FilterFormValues>();

  const currentField = watch(`conditions.${index}.field`) as FilterableField;
  const fieldType = BorrowerFilterFields[currentField]?.type ?? "string";
  const validOperators = OperatorsByType[fieldType];

  function handleFieldChange(
    newField: FilterableField,
    onChange: (value: FilterableField) => void,
  ) {
    const newType = BorrowerFilterFields[newField].type;
    const currentOperator = watch(`conditions.${index}.operator`);
    onChange(newField);
    if (!OperatorsByType[newType].includes(currentOperator)) {
      setValue(`conditions.${index}.operator`, OperatorsByType[newType][0]);
    }
    setValue(`conditions.${index}.value`, "");
  }

  return (
    <div className="flex items-center gap-2 mb-2" role="group" aria-label={`Filter ${index + 1}`}>
      <span className="w-12 text-sm text-gray-500 shrink-0 select-none">
        {index === 0 ? UI.whereLabel : UI.andLabel}
      </span>

      <Controller
        control={control}
        name={`conditions.${index}.field`}
        render={({ field }) => (
          <select
            value={field.value}
            onChange={(e) =>
              handleFieldChange(e.target.value as FilterableField, field.onChange)
            }
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            {fieldOptions.map(([key, meta]) => (
              <option key={key} value={key}>
                {meta.label}
              </option>
            ))}
          </select>
        )}
      />

      <Controller
        control={control}
        name={`conditions.${index}.operator`}
        render={({ field }) => (
          <select {...field} className="border border-gray-300 rounded px-2 py-1 text-sm">
            {validOperators.map((op) => (
              <option key={op} value={op}>
                {OperatorLabels[op]}
              </option>
            ))}
          </select>
        )}
      />

      <Controller
        control={control}
        name={`conditions.${index}.value`}
        render={({ field }) => (
          <input
            {...field}
            type={fieldType === "number" ? "number" : fieldType === "date" ? "date" : "text"}
            placeholder={fieldType === "date" ? undefined : "Value"}
            className="border border-gray-300 rounded px-2 py-1 text-sm min-w-32"
          />
        )}
      />

      <button
        type="button"
        onClick={onRemove}
        aria-label={UI.removeFilterLabel}
        className="text-gray-400 hover:text-gray-700 text-xl leading-none px-1"
      >
        ×
      </button>
    </div>
  );
}
