import { useState } from "react";
import { Leaf, Check, ChevronsUpDown, X } from "lucide-react";
import { FeatureForm } from "@/components/feature-form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function Remedies() {
  const [selected, setSelected] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const chips = [
    "Cold",
    "Cough",
    "Fever",
    "Headache",
    "Migraine",
    "Acidity",
    "Constipation",
    "Diarrhea",
    "Sore throat",
    "Stomach Pain",
    "Indigestion",
    "Nausea",
    "Vomiting",
    "Body Pain",
    "Back Pain",
    "Toothache",
    "Ear Pain",
    "Allergy",
    "Insomnia",
    "Stress",
  ];

  const handleSelect = (currentValue: string) => {
    // We normalize case for custom vs preset but keep the original string for display
    const normalizedSelected = selected.map(s => s.toLowerCase());
    const isAlreadySelected = normalizedSelected.includes(currentValue.toLowerCase());

    if (isAlreadySelected) {
      setSelected((prev) => prev.filter((item) => item.toLowerCase() !== currentValue.toLowerCase()));
    } else {
      setSelected((prev) => [...prev, currentValue]);
    }
  };

  const removeSymptom = (symptom: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelected((prev) => prev.filter((item) => item !== symptom));
  };

  return (
    <FeatureForm
      feature="remedies"
      title="Home Remedies"
      subtitle="Gentle, traditional remedies for common everyday issues."
      icon={<Leaf className="h-5 w-5" />}
      buildQuery={() => selected.length > 0 ? selected.join(", ") : null}
    >
      <div className="space-y-1.5 flex flex-col">
        <Label>Health problems</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between h-auto min-h-10 font-normal hover:bg-background"
            >
              {selected.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {selected.map((symptom) => (
                    <Badge
                      variant="secondary"
                      key={symptom}
                      className="mr-1 mb-1"
                      onClick={(e) => removeSymptom(symptom, e)}
                    >
                      {symptom}
                      <button
                        className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            removeSymptom(symptom, e as any);
                          }
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onClick={(e) => removeSymptom(symptom, e)}
                      >
                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <span className="text-muted-foreground">Select symptoms...</span>
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput 
                placeholder="Search or add symptom..." 
                value={inputValue}
                onValueChange={setInputValue}
              />
              <CommandList>
                <CommandEmpty>
                  No preset symptom found.
                </CommandEmpty>
                <CommandGroup>
                  {chips.map((symptom) => (
                    <CommandItem
                      key={symptom}
                      value={symptom}
                      onSelect={() => {
                        handleSelect(symptom);
                        setInputValue("");
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selected.some(s => s.toLowerCase() === symptom.toLowerCase()) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {symptom}
                    </CommandItem>
                  ))}
                  {inputValue.trim() !== "" && !chips.some(c => c.toLowerCase() === inputValue.trim().toLowerCase()) && (
                    <CommandItem
                      value={inputValue.trim()}
                      onSelect={() => {
                        handleSelect(inputValue.trim());
                        setInputValue("");
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selected.some(s => s.toLowerCase() === inputValue.trim().toLowerCase()) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      Add "{inputValue.trim()}"
                    </CommandItem>
                  )}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </FeatureForm>
  );
}
