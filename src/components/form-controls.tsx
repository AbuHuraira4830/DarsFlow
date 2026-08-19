"use client";

import { parseDate, type CalendarDate } from "@internationalized/date";
import {
  Button,
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  DateInput,
  DatePicker,
  DateSegment,
  Dialog,
  FieldError,
  Group,
  Heading,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
  SelectValue,
  Text,
} from "react-aria-components";

export interface ProductOption {
  value: string;
  label: string;
}

interface ProductSelectProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  options: ProductOption[];
  onChange: (value: string) => void;
  error?: string;
  help?: string;
  required?: boolean;
}

const triggerClass = "mt-2 flex min-h-11 w-full items-center justify-between gap-3 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-left text-[0.9375rem] text-slate-950 shadow-[0_1px_2px_rgba(15,23,42,0.04)] outline-none transition hover:border-slate-400 data-[focus-visible]:border-teal-600 data-[focus-visible]:ring-4 data-[focus-visible]:ring-teal-600/10 data-[invalid]:border-rose-600 data-[invalid]:bg-rose-50/40";

export function ProductSelect({ id, label, placeholder, value, options, onChange, error, help, required }: ProductSelectProps) {
  return (
    <Select
      id={id}
      name={id}
      selectedKey={value || null}
      onSelectionChange={(key) => onChange(String(key))}
      isInvalid={Boolean(error)}
      isRequired={required}
      className="min-w-0"
    >
      <Label className="block text-[0.8125rem] font-bold text-slate-700">
        {label} <Requirement required={required} />
      </Label>
      <Button className={triggerClass}>
        <SelectValue className="min-w-0 flex-1 truncate data-[placeholder]:text-slate-400">{({ selectedText }) => selectedText || placeholder}</SelectValue>
        <ChevronIcon />
      </Button>
      {help && <Text slot="description" className="mt-1.5 block text-[0.6875rem] leading-4 text-slate-500">{help}</Text>}
      <FieldError className="mt-1.5 text-xs font-bold text-rose-700">{error}</FieldError>
      <Popover placement="bottom start" className="z-[100] w-[--trigger-width] overflow-hidden rounded-xl border border-teal-100 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.14)] outline-none data-[entering]:animate-in data-[exiting]:animate-out">
        <ListBox items={options} className="max-h-64 overflow-y-auto p-1.5 outline-none">
          {(option) => (
            <ListBoxItem id={option.value} textValue={option.label} className="group flex cursor-default items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 outline-none data-[focused]:bg-teal-50 data-[focused]:text-teal-950 data-[selected]:font-bold data-[selected]:text-teal-800">
              <span className="min-w-0 truncate">{option.label}</span>
              <span className="invisible shrink-0 text-teal-700 group-data-[selected]:visible"><CheckIcon /></span>
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
    </Select>
  );
}

interface ProductDatePickerProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}

export function ProductDatePicker({ id, label, value, onChange, error, required }: ProductDatePickerProps) {
  const parsedValue = value ? parseDate(value) : null;
  const readableDate = parsedValue
    ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`))
    : "Choose a date";

  return (
    <DatePicker
      id={id}
      name={id}
      value={parsedValue}
      onChange={(date: CalendarDate | null) => onChange(date?.toString() ?? "")}
      isInvalid={Boolean(error)}
      isRequired={required}
      granularity="day"
    >
      <Label className="block text-[0.8125rem] font-bold text-slate-700">
        {label} <Requirement required={required} />
      </Label>
      <Group className={`${triggerClass} p-0 focus-within:border-teal-600 focus-within:ring-4 focus-within:ring-teal-600/10`}>
        <DateInput className="flex min-w-0 flex-1 items-center px-3.5 py-2.5">
          {(segment) => <DateSegment segment={segment} className="rounded px-0.5 outline-none data-[focused]:bg-teal-100 data-[placeholder]:text-slate-400" />}
        </DateInput>
        <Button aria-label="Open calendar" className="grid min-h-11 w-11 shrink-0 place-items-center rounded-r-xl text-teal-700 outline-none transition hover:bg-teal-50 data-[focus-visible]:ring-2 data-[focus-visible]:ring-inset data-[focus-visible]:ring-teal-600">
          <CalendarIcon />
        </Button>
      </Group>
      <Text slot="description" className="mt-1.5 block text-[0.6875rem] font-medium text-slate-500">{readableDate}</Text>
      <FieldError className="mt-1.5 text-xs font-bold text-rose-700">{error}</FieldError>
      <Popover placement="bottom start" className="z-[100] w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-teal-100 bg-white p-1 shadow-[0_20px_55px_rgba(15,23,42,0.16)] outline-none">
        <Dialog className="outline-none">
          <Calendar className="p-3 text-sm text-slate-700">
            <header className="mb-3 flex items-center justify-between gap-2">
              <Button slot="previous" aria-label="Previous month" className="grid size-9 place-items-center rounded-lg text-slate-600 outline-none hover:bg-teal-50 data-[focus-visible]:ring-2 data-[focus-visible]:ring-teal-600"><PreviousIcon /></Button>
              <Heading className="font-bold text-slate-950" />
              <Button slot="next" aria-label="Next month" className="grid size-9 place-items-center rounded-lg text-slate-600 outline-none hover:bg-teal-50 data-[focus-visible]:ring-2 data-[focus-visible]:ring-teal-600"><NextIcon /></Button>
            </header>
            <CalendarGrid className="w-full border-separate border-spacing-1">
              <CalendarGridHeader>
                {(day) => <CalendarHeaderCell className="pb-1 text-center text-[0.6875rem] font-bold text-slate-400">{day}</CalendarHeaderCell>}
              </CalendarGridHeader>
              <CalendarGridBody>
                {(date) => <CalendarCell date={date} className="grid size-9 place-items-center rounded-lg outline-none transition hover:bg-teal-50 data-[disabled]:text-slate-300 data-[focus-visible]:ring-2 data-[focus-visible]:ring-teal-600 data-[outside-month]:text-slate-300 data-[selected]:bg-teal-700 data-[selected]:font-bold data-[selected]:text-white data-[today]:ring-1 data-[today]:ring-inset data-[today]:ring-teal-500" />}
              </CalendarGridBody>
            </CalendarGrid>
          </Calendar>
        </Dialog>
      </Popover>
    </DatePicker>
  );
}

function Requirement({ required }: { required?: boolean }) {
  return <span className={required ? "text-rose-700" : "font-medium text-slate-400"}>{required ? "*" : "Optional"}</span>;
}

const Icon = ({ children }: { children: React.ReactNode }) => <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">{children}</svg>;
const ChevronIcon = () => <Icon><path d="m8 10 4 4 4-4" /></Icon>;
const CheckIcon = () => <Icon><path d="m5 12 4 4L19 6" /></Icon>;
const CalendarIcon = () => <Icon><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></Icon>;
const PreviousIcon = () => <Icon><path d="m15 18-6-6 6-6" /></Icon>;
const NextIcon = () => <Icon><path d="m9 18 6-6-6-6" /></Icon>;
