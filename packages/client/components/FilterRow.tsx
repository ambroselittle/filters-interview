import { useFormContext, Controller } from "react-hook-form";
import { BorrowerFields, OperatorsByType, type FieldMeta, type FilterableField, type FilterCondition } from "shared";
import { OperatorLabels, UI } from "../labels";

type FilterFormValues = { conditions: FilterCondition[] };

type FilterRowProps = {
  index: number;
  onRemove: () => void;
  onAutoApply: () => void;
};

const fieldOptions = Object.entries(BorrowerFields) as Array<[FilterableField, FieldMeta]>;

export function FilterRow({ index, onRemove, onAutoApply }: FilterRowProps) {
  const { control, setValue, watch } = useFormContext<FilterFormValues>();

  const currentField = watch(`conditions.${index}.field`) as FilterableField;
  const currentOperator = watch(`conditions.${index}.operator`);
  const fieldMeta = BorrowerFields[currentField];
  const fieldType = fieldMeta?.type ?? "string";
  const hasAllowedValues = !!fieldMeta?.allowedValues;
  const validOperators = OperatorsByType[fieldType];
  const showDropdown = hasAllowedValues && currentOperator === "is";

  function handleFieldChange(
    newField: FilterableField,
    onChange: (value: FilterableField) => void,
  ) {
    const oldType = fieldType;
    const newMeta = BorrowerFields[newField];
    const newType = newMeta.type;
    onChange(newField);
    if (newMeta.allowedValues) {
      setValue(`conditions.${index}.operator`, "is");
    } else if (!OperatorsByType[newType].includes(currentOperator)) {
      setValue(`conditions.${index}.operator`, OperatorsByType[newType][0]);
    }
    // Preserve value only between plain text fields (same type, no dropdowns).
    const bothPlainText =
      oldType === "string" && newType === "string" && !fieldMeta?.allowedValues && !newMeta.allowedValues;
    if (!bothPlainText) {
      setValue(`conditions.${index}.value`, "");
    }
    onAutoApply();
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

      {hasAllowedValues ? (
        <span className="border border-transparent rounded px-2 py-1 text-sm">
          {OperatorLabels.is}
        </span>
      ) : (
        <Controller
          control={control}
          name={`conditions.${index}.operator`}
          render={({ field }) => (
            <select
              {...field}
              onChange={(e) => {
                field.onChange(e);
                onAutoApply();
              }}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              {validOperators.map((op) => (
                <option key={op} value={op}>
                  {OperatorLabels[op]}
                </option>
              ))}
            </select>
          )}
        />
      )}

      <Controller
        control={control}
        name={`conditions.${index}.value`}
        render={({ field }) =>
          showDropdown ? (
            <select
              {...field}
              onChange={(e) => {
                field.onChange(e);
                if (e.target.value) onAutoApply();
              }}
              className="border border-gray-300 rounded px-2 py-1 text-sm min-w-32"
            >
              <option value="">Select…</option>
              {fieldMeta.allowedValues!.map((v) => (
                <option key={v} value={v}>
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </option>
              ))}
            </select>
          ) : (
            <input
              {...field}
              type={fieldType === "number" ? "number" : fieldType === "date" ? "date" : "text"}
              placeholder={fieldType === "date" ? undefined : "Value"}
              className="border border-gray-300 rounded px-2 py-1 text-sm min-w-32"
            />
          )
        }
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
