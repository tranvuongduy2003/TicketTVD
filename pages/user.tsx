import { AdminLayout } from '@/components/layout';
import {
  SearchInput,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui';
import { CustomerTable, OrganizerTable } from '@/components/user';
import { columns } from '@/components/user/columns';
import { NextPageWithLayout } from '@/models';

const UserPage: NextPageWithLayout = props => {
  return (
    <div className="w-full px-8 py-20">
      <h1 className="text-[32px] leading-[48px] font-bold mb-7">
        Quản lý người dùng
      </h1>

      <div className="flex items-center justify-between w-full">
        <SearchInput placeholder="Tìm kiếm" className="w-[260px]" />
        <div className="flex items-center gap-8">
          <span className="text-sm font-normal leading-[22px]">
            Cập nhật mới nhất: 10 phút trước
          </span>
          <Select defaultValue="ticket">
            <SelectTrigger className="w-[280px] bg-neutral-200 text-neutral-600">
              <SelectValue placeholder="Sắp xếp theo: " />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="ticket">
                  Sắp xếp theo: Tổng vé đã mua
                </SelectItem>
                <SelectItem value="date">
                  Sắp xếp theo: Ngày tham gia
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Tabs defaultValue="customer">
          <TabsList className="bg-transparent shadow-none h-auto mt-2 mb-7">
            <TabsTrigger
              value="customer"
              className="border-b-[3px] border-solid border-transparent px-3 py-[15px] data-[state=active]:border-b-[3px] data-[state=active]:border-solid data-[state=active]:border-primary-500 data-[state=active]:text-primary-500 rounded-none"
            >
              Khán giả
            </TabsTrigger>
            <TabsTrigger
              value="organizer"
              className="border-b-[3px] border-solid border-transparent px-3 py-[15px] data-[state=active]:border-b-[3px] data-[state=active]:border-solid data-[state=active]:border-primary-500 data-[state=active]:text-primary-500 rounded-none"
            >
              Chủ sự kiện
            </TabsTrigger>
          </TabsList>
          <TabsContent value="customer">
            <CustomerTable data={[]} columns={columns} />
          </TabsContent>
          <TabsContent value="organizer">
            <OrganizerTable />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

UserPage.Layout = AdminLayout;

export default UserPage;
