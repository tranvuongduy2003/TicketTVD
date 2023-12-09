'use client';

import { cn } from '@/types';
import { ReactNode, useEffect, useState } from 'react';
import { LuChevronDown } from 'react-icons/lu';
import {
  Button,
  Checkbox,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Separator
} from '../ui';
import { Category, Event } from '@/models';
import { useForm } from 'react-hook-form';

export interface FilterBarProps {
  events: Event[];
  categories: Category[];
  setFilter: Function;
}

export interface FilterSectionProps {
  title: ReactNode;
  children?: ReactNode;
}

const generalItems = [
  {
    id: 'all',
    label: 'Tất cả'
  },
  {
    id: 'upcoming',
    label: 'Sắp diễn ra'
  }
];

const paidItems = [
  {
    id: 'free',
    label: 'Miễn phí'
  },
  {
    id: 'paid',
    label: 'Trả phí'
  }
];

export function FilterBar({ categories, setFilter, events }: FilterBarProps) {
  const form = useForm<{ items: string[] }>({
    defaultValues: {
      items: ['all']
    }
  });

  const selectEvent = (event: Event) => {
    if (form.watch().items.length <= 0) {
      return true;
    }

    for (let index = 0; index < form.watch().items.length; index++) {
      const key = form.watch().items[index];

      switch (key) {
        case 'all':
          return true;
        case 'upcoming':
          if (new Date(event.eventDate) > new Date()) return true;
          break;
        case 'free':
          if (event.ticketPrice === 0) return true;
          break;
        case 'paid':
          if (event.ticketPrice !== 0) return true;
          break;

        default:
          if (key === event.categoryId?.toString()) return true;
          break;
      }
    }

    return false;
  };

  useEffect(() => {
    (() => {
      if (form.watch().items.length <= 0) {
        form.setValue('items', ['all']);
      }
    })();
  }, [form.watch().items]);

  return (
    <div className="w-[276px] bg-neutral-100 rounded-m">
      <h5 className="text-xl font-bold p-4 border-b-2 border-solid border-neutral-300">
        Bộ lọc tìm kiếm
      </h5>
      <div className="p-4">
        <FilterSection title={'Thể loại'}>
          <div className="flex flex-col gap-2">
            <Form {...form}>
              <form className="flex flex-col gap-2">
                {generalItems.map(item => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="items"
                    render={({ field }) => {
                      return (
                        <FormItem className="flex items-center gap-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={checked => {
                                if (item.id === 'all' && checked) {
                                  return field.onChange(['all']);
                                }

                                return checked
                                  ? field.onChange([
                                      ...field.value.filter(
                                        item => item !== 'all'
                                      ),
                                      ,
                                      item.id
                                    ])
                                  : field.onChange(
                                      field.value?.filter(
                                        value => value !== item.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-base !mt-0">
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </form>
            </Form>
            <Form {...form}>
              <form className="flex flex-col gap-2">
                {categories.map(category => (
                  <FormField
                    key={category.id}
                    control={form.control}
                    name="items"
                    render={({ field }) => {
                      return (
                        <FormItem className="flex items-center gap-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(
                                category.id.toString()
                              )}
                              onCheckedChange={checked => {
                                return checked
                                  ? field.onChange([
                                      ...field.value.filter(
                                        item => item !== 'all'
                                      ),
                                      category.id.toString()
                                    ])
                                  : field.onChange(
                                      field.value?.filter(
                                        value =>
                                          value !== category.id.toString()
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-base !mt-0">
                            {category.name}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </form>
            </Form>
          </div>
        </FilterSection>
        <Separator className="my-4" />
        <FilterSection title="Giá">
          <Form {...form}>
            <form className="flex justify-between items-center">
              {paidItems.map(item => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="items"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={checked => {
                              return checked
                                ? field.onChange([
                                    ...field.value.filter(
                                      item => item !== 'all'
                                    ),
                                    item.id
                                  ])
                                : field.onChange(
                                    field.value?.filter(
                                      value => value !== item.id
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-base !mt-0">
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </form>
          </Form>
        </FilterSection>
        <Separator className="my-4" />
        <div className="flex items-center justify-between gap-2">
          <Button
            variant={'ghost'}
            type="reset"
            className="text-primary-500 w-full"
            onClick={() => {
              form.reset();
              setFilter(events);
            }}
          >
            Xóa tất cả
          </Button>
          <Button
            type="button"
            className="text-white w-full"
            onClick={() => setFilter(events.filter(item => selectEvent(item)))}
          >
            Áp dụng
          </Button>
        </div>
      </div>
    </div>
  );
}

export function FilterSection({ title, children }: FilterSectionProps) {
  const [isHidden, setIsHidden] = useState<boolean>(false);

  return (
    <div>
      <div
        className="text-[15px] font-bold leading-6 flex items-center justify-between w-full cursor-pointer mb-2"
        onClick={() => setIsHidden(!isHidden)}
      >
        <div>{title}</div>
        <LuChevronDown />
      </div>
      <div
        className={cn(
          'transition-all pr-[15px]',
          isHidden ? 'opacity-0 invisible h-0' : 'opacity-100 visible h-auto'
        )}
      >
        {children}
      </div>
    </div>
  );
}
