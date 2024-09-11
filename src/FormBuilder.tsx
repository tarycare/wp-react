// @ts-nocheck
import { useForm } from "react-hook-form";
import { FC, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { DateTimePickerV2 } from "@/components/date-time-picker-v2";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { Separator } from "./components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Function to apply custom validation based on field configuration
const applyValidation = (field: any) => {
  const rules: any = {};

  if (field.required === "TRUE") {
    rules.required = `${field.label_en || field.label_ar} is required`;
  }

  if (field.min) {
    rules.minLength = {
      value: Number(field.min),
      message: `${field.label_en || field.label_ar} must be at least ${
        field.min
      } characters`,
    };
  }

  if (field.max) {
    rules.maxLength = {
      value: Number(field.max),
      message: `${field.label_en || field.label_ar} must be no more than ${
        field.max
      } characters`,
    };
  }

  return rules;
};

// Debounce function for performance improvement
const debounce = (func: Function, delay: number) => {
  let timeoutId: any;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const DynamicForm: FC<DynamicFormProps> = ({
  data = { sections: [] }, // Default to an object with an empty sections array to avoid undefined error
  languge,
  handleSubmission,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = useForm();

  const [selectedFramework, setSelectedFramework] = useState<string>("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const onSubmit = (data: any) => {
    handleSubmission(data);
  };

  const handleComboboxSelect = (currentValue: string, fieldName: string) => {
    const updatedValue = currentValue === selectedFramework ? "" : currentValue;
    setSelectedFramework(updatedValue);
    setValue(fieldName, updatedValue);
    debouncedTrigger(fieldName);
  };

  const debouncedTrigger = debounce(trigger, 300);

  const handleMultiSelectChange = (values: string[], fieldName: string) => {
    setSelectedSkills(values);
    setValue(fieldName, values);
    debouncedTrigger(fieldName);
  };

  const renderComponent = (field: any) => {
    const label = languge === "ar" ? field.label_ar : field.label_en;
    const placeholder =
      languge === "ar" ? field.placeholder_ar : field.placeholder_en;

    switch (field.type.toLowerCase()) {
      case "text":
      case "email":
      case "phone":
      case "number":
        return (
          <Input
            type={field.type.toLowerCase()}
            placeholder={placeholder}
            {...register(field.name, applyValidation(field))}
            className="border p-2 rounded-md bg-background"
          />
        );
      case "textarea":
        return (
          <Textarea
            placeholder={placeholder}
            {...register(field.name, applyValidation(field))}
            className="border p-2 rounded-md bg-background"
          />
        );
      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox id={field.name} {...register(field.name)} />
            <label htmlFor={field.name} className="text-sm font-medium">
              {label}
            </label>
          </div>
        );
      case "radio":
        return (
          <div>
            {field.items?.map((item: any) => (
              <div key={item.value} className="flex items-center">
                <input
                  type="radio"
                  value={item.value}
                  {...register(field.name, applyValidation(field))}
                />
                <label className="ml-2">
                  {languge === "ar" ? item.label_ar : item.label_en}
                </label>
              </div>
            ))}
          </div>
        );
      case "multi-select":
        return (
          <MultiSelect
            options={field.items}
            onValueChange={(values) =>
              handleMultiSelectChange(values, field.name)
            }
            defaultValue={selectedSkills}
            placeholder={placeholder}
          />
        );
      case "date":
        return (
          <DateTimePickerV2
            placeholder={placeholder}
            selectedDate={(date) => {
              setSelectedDate(date);
              setValue(field.name, date);
              debouncedTrigger(field.name);
            }}
          />
        );
      case "select":
        return (
          <>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[200px] justify-between text-muted-foreground"
                >
                  {selectedFramework
                    ? field.items.find(
                        languge === "ar"
                          ? (f: any) => f.value === selectedFramework
                          : (f: any) => f.value === selectedFramework
                      )[languge === "ar" ? "label_ar" : "label_en"]
                    : placeholder}
                  <CaretSortIcon className="ms-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0 text-muted-foreground">
                <Command>
                  <CommandInput placeholder={placeholder} className="h-9" />
                  <CommandList>
                    <CommandEmpty>No items found.</CommandEmpty>
                    <CommandGroup>
                      {field.items?.map((item: any) => (
                        <CommandItem
                          key={item.value}
                          value={item.value}
                          onSelect={() =>
                            handleComboboxSelect(item.value, field.name)
                          }
                        >
                          {languge === "ar" ? item.label_ar : item.label_en}
                          <CheckIcon
                            className={cn(
                              "ms-auto h-4 w-4",
                              selectedFramework === item.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {errors[field.name] && (
              <p className="text-red-500 text-sm mt-2">
                {errors[field.name]?.message}
              </p>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <Accordion
        type="multiple"
        className="w-full"
        defaultValue={[
          `item-0`,
          `item-1`,
          `item-2`,
          `item-3`,
          `item-4`,
          `item-5`,
          `item-6`,
          `item-7`,
          `item-8`,
          `item-9`,
        ]}
      >
        {data?.map(
          (
            section,
            index // Optional chaining for data and sections
          ) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>
                <div className="flex items-center gap-x-2 py-2 pb-0">
                  <div>{section.section_icon}</div>
                  <div>
                    {languge === "ar"
                      ? section.section_label_ar
                      : section.section_label_en}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm font-normal text-gray-500 mt-[2px]">
                  {languge === "ar"
                    ? section.section_description_ar
                    : section.section_description_en}
                </p>
                <Separator className="mb-4 mt-2 bg-gray-300" />
                {section.Fields?.map((field) => (
                  <div key={field.name} className="flex flex-col mb-4 mx-1">
                    <Label htmlFor={field.name} className="font-medium mb-2">
                      {languge === "ar" ? field.label_ar : field.label_en}
                    </Label>
                    {renderComponent(field)}
                    {errors[field.name] && (
                      <p className="text-red-500 text-sm mt-[4px]">
                        {errors[field.name]?.message}
                      </p>
                    )}
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          )
        )}
      </Accordion>
      <Button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded-md"
      >
        Submit
      </Button>
    </form>
  );
};

export default DynamicForm;
