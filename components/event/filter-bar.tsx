'use client';

import { Category, Event, EventStatus, PriceType } from '@/models';
import { cn } from '@/types';
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState
} from 'react';
import { useForm } from 'react-hook-form';
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

export interface FilterBarProps {
  categories: Category[];
  setFilter: Dispatch<
    SetStateAction<
      | {
          categoryKeys: string[];
          priceKeys: PriceType[];
          timeKeys: EventStatus[];
        }
      | undefined
    >
  >;
}

export interface FilterSectionProps {
  title: ReactNode;
  children?: ReactNode;
}

const paidItems = [
  {
    id: PriceType.FREE,
    label: 'Miễn phí'
  },
  {
    id: PriceType.PAID,
    label: 'Trả phí'
  }
];

const timeItems = [
  {
    id: EventStatus.UPCOMING,
    label: 'Sắp diễn ra'
  },
  {
    id: EventStatus.OPENING,
    label: 'Đang điễn ra'
  },
  {
    id: EventStatus.CLOSED,
    label: 'Đã kết thúc'
  }
];

export function FilterBar({ categories, setFilter }: FilterBarProps) {
  const form = useForm<{ items: string[] }>({
    defaultValues: {
      items: ['all']
    }
  });

  const priceForm = useForm<{ items: (PriceType | 'all')[] }>({
    defaultValues: {
      items: ['all']
    }
  });

  const timeForm = useForm<{ items: (EventStatus | 'all')[] }>({
    defaultValues: {
      items: ['all']
    }
  });

  useEffect(() => {
    (() => {
      if (form.watch().items.length <= 0) {
        form.setValue('items', ['all']);
      }
    })();
  }, [form.watch().items]);

  useEffect(() => {
    (() => {
      if (priceForm.watch().items.length <= 0) {
        priceForm.setValue('items', ['all']);
      }
    })();
  }, [priceForm.watch().items]);

  useEffect(() => {
    (() => {
      if (timeForm.watch().items.length <= 0) {
        timeForm.setValue('items', ['all']);
      }
    })();
  }, [timeForm.watch().items]);

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
                <FormField
                  key="all"
                  control={form.control}
                  name="items"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes('all')}
                            onCheckedChange={checked => {
                              if (checked) {
                                return field.onChange(['all']);
                              }

                              return checked
                                ? field.onChange([
                                    ...field.value.filter(
                                      item => item !== 'all'
                                    ),
                                    'all'
                                  ])
                                : field.onChange(
                                    field.value?.filter(
                                      value => value !== 'all'
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-base !mt-0">
                          Tất cả
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
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
          <Form {...priceForm}>
            <form className="flex flex-col gap-2">
              <FormField
                key="all"
                control={priceForm.control}
                name="items"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes('all')}
                          onCheckedChange={checked => {
                            if (checked) {
                              return field.onChange(['all']);
                            }

                            return checked
                              ? field.onChange([
                                  ...field.value.filter(item => item !== 'all'),
                                  'all'
                                ])
                              : field.onChange(
                                  field.value?.filter(value => value !== 'all')
                                );
                          }}
                        />
                      </FormControl>
                      <FormLabel className="text-base !mt-0">Tất cả</FormLabel>
                    </FormItem>
                  );
                }}
              />
              {paidItems.map(item => (
                <FormField
                  key={item.id}
                  control={priceForm.control}
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
        <FilterSection title="Thời gian">
          <Form {...timeForm}>
            <form className="flex flex-col gap-2">
              <FormField
                key="all"
                control={timeForm.control}
                name="items"
                render={({ field }) => {
                  return (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes('all')}
                          onCheckedChange={checked => {
                            if (checked) {
                              return field.onChange(['all']);
                            }

                            return checked
                              ? field.onChange([
                                  ...field.value.filter(item => item !== 'all'),
                                  'all'
                                ])
                              : field.onChange(
                                  field.value?.filter(value => value !== 'all')
                                );
                          }}
                        />
                      </FormControl>
                      <FormLabel className="text-base !mt-0">Tất cả</FormLabel>
                    </FormItem>
                  );
                }}
              />
              {timeItems.map(item => (
                <FormField
                  key={item.id}
                  control={timeForm.control}
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
              setFilter(undefined);
            }}
          >
            Xóa tất cả
          </Button>
          <Button
            type="button"
            className="text-white w-full"
            onClick={() => {
              setFilter({
                categoryKeys: form.watch().items.filter(item => item !== 'all'),
                priceKeys: priceForm
                  .watch()
                  .items.filter(item => item !== 'all') as PriceType[],
                timeKeys: timeForm
                  .watch()
                  .items.filter(item => item !== 'all') as EventStatus[]
              });
            }}
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
