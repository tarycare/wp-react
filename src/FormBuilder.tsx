// @ts-nocheck
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"; // Import Accordion components
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"; // For Combobox
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { Separator } from "./components/ui/separator";

// Dynamically create Zod schema based on the JSON structure
const createSchema = (sections: any) => {
  const schemaObject: any = {};
  sections.forEach((section: any) => {
    section.fields.forEach((field: any) => {
      let validation;

      if (field.type === "multi-select") {
        // MultiSelect returns an array, so validate it as an array
        validation = z
          .array(z.string()) // Each value in the array is a string
          .min(field.validation?.min || 1, field.validation?.required) // Minimum number of selected items
          .max(
            field.validation?.max || 3,
            `You can select up to ${field.validation?.max || 3} items`
          );
      } else {
        // Default validation for string fields
        validation = z.string();
        if (field.validation?.required) {
          validation = validation.nonempty(field.validation.required);
        }
        if (field.validation?.minLength) {
          validation = validation.min(
            field.validation.minLength.value,
            field.validation.minLength.message
          );
        }
        if (field.validation?.maxLength) {
          validation = validation.max(
            field.validation.maxLength.value,
            field.validation.maxLength.message
          );
        }
      }

      schemaObject[field.name] = validation;
    });
  });
  return z.object(schemaObject);
};

const DynamicForm: FC<DynamicFormProps> = ({
  data,
  languge,
  handleSubmission,
}: {
  data: any;
  languge: string;
  handleSubmission: (data: any) => void;
}) => {
  const schema = createSchema(data);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const [selectedFramework, setSelectedFramework] = useState<string>("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const onSubmit = (data: any) => {
    handleSubmission(data);
  };

  // Function to dynamically render components based on JSON config
  const renderComponent = (field: any) => {
    const allowedCharacters = field.allowedCharacters || ""; // Get allowed characters from the field config

    // Escape special characters in the allowedCharacters string, particularly the hyphen (-)
    const escapeRegExp = (string: string) => {
      return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape regex special characters
    };

    const handleBeforeInput = (event: React.FormEvent<HTMLInputElement>) => {
      const { data } = event as any;

      // Escape hyphen (-) if it's part of the allowed characters
      const escapedAllowedChars = escapeRegExp(allowedCharacters);

      // Create a regex pattern to allow only specified characters
      const regex = new RegExp(`^[${escapedAllowedChars}]*$`); // Corrected the pattern

      // If the typed character doesn't match the allowed pattern, prevent the input
      if (!regex.test(data)) {
        event.preventDefault(); // Prevent the user from typing invalid characters
      }
    };

    switch (field.component) {
      case "Input":
        return (
          <Input
            dir={languge === "ar" ? "rtl" : "ltr"}
            type={field.type}
            placeholder={field.placeholder}
            {...register(field.name)}
            className="border p-2 rounded-md"
            maxLength={field.validation.maxLength?.value}
            onBeforeInput={
              field.allowedCharacters ? handleBeforeInput : undefined
            }
          />
        );
      case "Textarea":
        return (
          <Textarea
            placeholder={field.placeholder}
            {...register(field.name)}
            className="border p-2 rounded-md"
          />
        );
      case "Checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox id={field.name} {...register(field.name)} />
            <label
              htmlFor={field.name}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {field.label}
            </label>
          </div>
        );
      case "MultiSelect":
        return (
          <MultiSelect
            options={field.items}
            onValueChange={(values) => {
              setSelectedSkills(values);
              setValue(field.name, values); // Update form value
            }}
            defaultValue={selectedSkills}
            placeholder={field.placeholder}
            maxCount={field.validation.max}
          />
        );

      case "Combobox":
        return (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[200px] justify-between text-muted-foreground"
              >
                {selectedFramework
                  ? field.items.find((f: any) => f.value === selectedFramework)
                      ?.label
                  : field.placeholder}
                <CaretSortIcon className="ms-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0 text-muted-foreground">
              <Command>
                <CommandInput
                  placeholder={field.placeholder}
                  className="h-9 "
                />
                <CommandList>
                  <CommandEmpty>No items found.</CommandEmpty>
                  <CommandGroup>
                    {field.items.map((framework: any) => (
                      <CommandItem
                        key={framework.value}
                        value={framework.value}
                        onSelect={(currentValue) => {
                          setSelectedFramework(
                            currentValue === selectedFramework
                              ? ""
                              : currentValue
                          );
                          setValue(field.name, currentValue); // Update form value
                          setOpen(false);
                        }}
                      >
                        {framework.label}
                        <CheckIcon
                          className={cn(
                            "ms-auto h-4 w-4",
                            selectedFramework === framework.value
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
        );
      case "DatePicker":
        return (
          <DateTimePickerV2
            placeholder={languge === "ar" ? "اختر التاريخ" : "Select date"}
            selectedDate={(date) => {
              setValue(field.name, date); // Update form value
            }}
          />
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
        defaultValue={data.map((_, index) => `item-${index}`)}
      >
        {data.map((section, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            {!section.notCollapsible ? (
              <>
                <AccordionTrigger>
                  <div>
                    <div
                      className={`flex items-center pt-[6px] ${
                        section.sectionIcon && "gap-x-2"
                      }`}
                    >
                      <div>{section.sectionIcon}</div>
                      <div>{section.sectionTitle}</div>
                    </div>
                  </div>
                </AccordionTrigger>
              </>
            ) : (
              <>
                <div>
                  <div
                    className={`flex flex-1 items-center pt-[14px] text-sm font-medium transition-all  [&[data-state=open]>svg]:rotate-180 ${
                      section.sectionIcon && "gap-x-2"
                    }`}
                  >
                    <div>{section.sectionIcon}</div>
                    <div className="font-bold">{section.sectionTitle}</div>
                  </div>
                </div>
              </>
            )}
            <AccordionContent>
              <p
                className={`text-[12px] font-normal text-[#999] mt-[0px] ${
                  section.sectionIcon ? "ms-5" : "ms-0"
                }`}
              >
                {section.sectionDescription}
              </p>
              <Separator className="my-2" />

              {section.fields.map((field) => (
                <div key={field.name} className="flex flex-col mb-4 mx-1">
                  <label htmlFor={field.name} className="font-medium mb-1">
                    {field.label}
                  </label>
                  {renderComponent(field)}
                  {errors[field.name] && (
                    <p className="text-red-500 text-sm">
                      {(errors as any)[field.name]?.message}
                    </p>
                  )}
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded-md"
      >
        Submit
      </button>
    </form>
  );
};

export default DynamicForm;
