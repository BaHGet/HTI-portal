import React, { useState, useMemo } from "react";
import { registableCourses } from "../../constants";
import { PlusCircle, Trash, RefreshCcw, Download } from "lucide-react";
import { Table, Grid, Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

const Registration = () => {
  const allowedCreditHours = 21;

  const allGroups = useMemo(() => {
    return registableCourses.flatMap((course) =>
      course.groups.map((group) => ({
        ...course,
        ...group,
      }))
    );
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [availableGroups, setAvailableGroups] = useState(allGroups);
  const [visibleColumns, setVisibleColumns] = useState({
    code: true,
    name: true,
    group: true,
    days: true,
    time: true,
    seats: true,
    credit: true,
  });
  const [opened, { open, close }] = useDisclosure(false);

  const slots = [
    { id: 1, label: "", colour: "red" },
    { id: 2, label: "", colour: "green" },
    { id: 3, label: "", colour: "blue" },
    { id: 4, label: "", colour: "yellow" },
    { id: 5, label: "", colour: "purple" },
    { id: 6, label: "", colour: "red" },
    { id: 7, label: "", colour: "red" },
    { id: 8, label: "", colour: "red" },
  ];

  const [days, setdays] = useState([
    { id: 1, name: "السبت", slot: slots },
    { id: 2, name: "الأحد", slot: slots },
    { id: 3, name: "الإثنين", slot: slots },
    { id: 4, name: "الثلاثاء", slot: slots },
    { id: 5, name: "الأربعاء", slot: slots },
  ]);

  const filteredGroups = availableGroups.filter(
    (g) =>
      g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRegisteredCredits = registeredCourses.reduce(
    (sum, c) => sum + c.creditHours,
    0
  );

  const handleAdd = (group) => {
    // check if same course in another group exists
    const sameCourseOtherGroup = registeredCourses.some(
      (c) => c.code === group.code && c.groupNumber !== group.groupNumber
    );

    // check credit hours limit
    if (totalRegisteredCredits + group.creditHours > allowedCreditHours) {
      setModalMessage("لقد تخطيت الحد الأقصي لعدد الساعات المسموح به للتسجيل");
      open();
      return;
    }

    if (sameCourseOtherGroup) {
      setModalMessage("لقد قمت بإضافة هذه المادة في مجموعة أخرى مسبقاً.");
      open();
      return;
    }

    setRegisteredCourses([...registeredCourses, group]);
    setAvailableGroups(
      availableGroups.filter(
        (c) => !(c.code === group.code && c.groupNumber === group.groupNumber)
      )
    );
  };

  const handleRemove = (group) => {
    setRegisteredCourses(
      registeredCourses.filter(
        (c) => !(c.code === group.code && c.groupNumber === group.groupNumber)
      )
    );
    setAvailableGroups([...availableGroups, group]);
  };

  const toggleColumn = (col) => {
    setVisibleColumns((prev) => ({ ...prev, [col]: !prev[col] }));
  };

  const renderDays = (days) => days.join(" - ");

  // New Table component
  const registerTableRows = filteredGroups.map((element, idx) => (
    <Table.Tr key={idx}>
      <Table.Td className="text-center">
        <button
          className="text-gray-600 hover:text-green-500 cursor-pointer"
          onClick={() => handleAdd(element)}
        >
          <PlusCircle size={20} />
        </button>
      </Table.Td>
      {visibleColumns.code && (
        <Table.Td className="text-center">{element.code}</Table.Td>
      )}
      {visibleColumns.name && (
        <Table.Td className="text-center">{element.name}</Table.Td>
      )}
      {visibleColumns.group && (
        <Table.Td className="text-center">{element.groupNumber}</Table.Td>
      )}
      {visibleColumns.days && (
        <Table.Td className="text-center">{element.days}</Table.Td>
      )}
      {visibleColumns.time && (
        <Table.Td className="text-center">
          {element.timeStart} - {element.timeEnd}
        </Table.Td>
      )}
      {visibleColumns.seats && (
        <Table.Td className="text-center">{element.availableSeats}</Table.Td>
      )}
      {visibleColumns.credit && (
        <Table.Td className="text-center">{element.creditHours}</Table.Td>
      )}
    </Table.Tr>
  ));

  const registeredSubjectsRows = registeredCourses.map((element, idx) => (
    <Table.Tr key={idx}>
      <Table.Td className="text-center">
        <button
          className="text-gray-600 hover:text-red-500 cursor-pointer"
          onClick={() => handleRemove(element)}
        >
          <Trash size={20} />
        </button>
      </Table.Td>
      <Table.Td className="text-center">{element.code}</Table.Td>
      <Table.Td className="text-center">{element.name}</Table.Td>
      <Table.Td className="text-center">{element.groupNumber}</Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      {/* Modal */}
      <Modal opened={opened} onClose={close} withCloseButton={false}>
        <div className="text-center">{modalMessage}</div>
      </Modal>

      {/* Main Content */}

      <div className="text-xl font-bold mb-1">تسجيل المقررات</div>

      <div className="felx flex-col h-[85vh] gap-4">
        {/* الجدول الأول */}
        <div className="card p-0 rounded-xl h-[65%] flex flex-col">
          <div className="flex pt-4 px-4 justify-between">
            <div className="flex">
              <Button
                rightSection={<RefreshCcw />}
                className="ml-2 px-0"
                color="blue"
              >
                {" "}
                <p>تحديث</p>
              </Button>
              <div className="mx-10 input w-60">
                <input
                  type="text"
                  placeholder="بحث ..."
                  className="w-full bg-transparent text-slate-900 outline-0 placeholder:text-slate-500 dark:text-slate-50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex pt-2">
              <div className="mx-5">
                عدد الساعات المسموح به: {allowedCreditHours}
              </div>
              <div className="mx-5">
                عدد الساعات المسجلة: {totalRegisteredCredits}
              </div>
              <div className="mx-5">
                الساعات المتاحة: {allowedCreditHours - totalRegisteredCredits}
              </div>
            </div>
          </div>

          {/* Checkbox التحكم في الأعمدة */}
          <div className="flex flex-wrap gap-3 px-4 py-1 border-t">
            {Object.keys(visibleColumns).map((col) => (
              <label key={col} className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={visibleColumns[col]}
                  onChange={() => toggleColumn(col)}
                />
                {col === "code"
                  ? "كود المادة"
                  : col === "name"
                  ? "اسم المادة"
                  : col === "group"
                  ? "مجموعة"
                  : col === "days"
                  ? "الأيام"
                  : col === "time"
                  ? "التوقيت"
                  : col === "seats"
                  ? "المقاعد"
                  : "Cr.Hrs"}
              </label>
            ))}
          </div>

          {/* جدول المواد */}
          <div className="max-h-[calc(50vh-70px)] overflow-y-auto">
            <Table
              stickyHeader
              striped
              highlightOnHover
              withColumnBorders
              styles={{
                th: { textAlign: "center", verticalAlign: "middle" },
                td: { textAlign: "center", verticalAlign: "middle" }, // كمان يخلي الـ rows في النص
              }}
            >
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>إضافة</Table.Th>
                  {visibleColumns.code && <Table.Th>كود المادة</Table.Th>}
                  {visibleColumns.name && <Table.Th>اسم المادة</Table.Th>}
                  {visibleColumns.group && <Table.Th>المجموعة</Table.Th>}
                  {visibleColumns.days && <Table.Th>الأيام</Table.Th>}
                  {visibleColumns.time && <Table.Th>التوقيت</Table.Th>}
                  {visibleColumns.seats && <Table.Th>المقاعد</Table.Th>}
                  {visibleColumns.credit && <Table.Th>Cr.Hrs</Table.Th>}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{registerTableRows}</Table.Tbody>
            </Table>
          </div>
        </div>

        {/* الجدول الثاني */}
        <div className="grid grid-cols-2 gap-4 gap-y-0 mt-3 h-[35%]">
          <div className="card p-0 rounded-xl flex flex-col overflow-y-auto">
            <div className="text-center align-middle p-1 font-bold border-b flex justify-between items-center">
              <div className="pr-4">المواد المسجلة</div>
              <Button
                rightSection={<Download />}
                className="ml-2 px-0"
                variant="outline"
                color="red"
                size="xs"
              >
                {" "}
                <p>كارت التسجيل</p>
              </Button>
            </div>
            <div className="overflow-x-auto flex-1">
              <div className="max-h-[calc(85vh/2-60px)] ">
                <Table
                  stickyHeader
                  striped
                  highlightOnHover
                  withColumnBorders
                  styles={{
                    th: { textAlign: "center", verticalAlign: "middle" },
                    td: { textAlign: "center", verticalAlign: "middle" },
                  }}
                >
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>حذف</Table.Th>
                      {<Table.Th>كود المادة</Table.Th>}
                      {<Table.Th>اسم المادة</Table.Th>}
                      {<Table.Th>المجموعة</Table.Th>}
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>{registeredSubjectsRows}</Table.Tbody>
                </Table>
              </div>
            </div>
          </div>

          {/* معلومات الساعات */}
          <div className="card p-0 rounded-xl flex flex-col  gap-2">
            <div className="text-center align-middle p-1 font-bold border-b flex justify-between items-center">
              <div className="pr-4">جدول الطالب</div>
              <Button
                rightSection={<Download />}
                className="ml-2 px-0"
                color="green"
                variant="outline"
                size="xs"
              >
                {" "}
                <p>جدول الطالب</p>
              </Button>
            </div>
            <div className="p-0 pt-0 overflow-x-auto flex-1">
              <Table variant="vertical" layout="auto" withTableBorder>
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Th w={70}></Table.Th>
                    <Table.Td>
                      <Grid columns={32} align="flex-start">
                        <Grid.Col
                          className=" border-r border-b p-0 m-0"
                          span={4}
                        >
                          <div className="p-0 m-0">
                            <p className="text-center border-b text-xs">P1</p>
                            <p className="p-0 m-0 text-xs">09:45-09:00</p>
                          </div>
                        </Grid.Col>
                        <Grid.Col
                          className="text-center border-r border-b"
                          span={4}
                        >
                          <div className="p-0 m-0">
                            <p className="text-center border-b text-xs">P2</p>
                            <p className="p-0 m-0 text-xs">10:30-09:45</p>
                          </div>
                        </Grid.Col>
                        <Grid.Col
                          className="text-center border-r border-b"
                          span={4}
                        >
                          <div className="p-0 m-0">
                            <p className="text-center border-b text-xs">P3</p>
                            <p className="p-0 m-0 text-xs">11:25-10:40</p>
                          </div>
                        </Grid.Col>
                        <Grid.Col
                          className="text-center border-r border-b"
                          span={4}
                        >
                          <div className="p-0 m-0">
                            <p className="text-center border-b text-xs">P4</p>
                            <p className="p-0 m-0 text-xs">12:10-11:25</p>
                          </div>
                        </Grid.Col>
                        <Grid.Col
                          className="text-center border-r border-b"
                          span={4}
                        >
                          <div className="p-0 m-0">
                            <p className="text-center border-b text-xs">P5</p>
                            <p className="p-0 m-0 text-xs">01:05-12:10</p>
                          </div>
                        </Grid.Col>
                        <Grid.Col
                          className="text-center border-r border-b"
                          span={4}
                        >
                          <div className="p-0 m-0">
                            <p className="text-center border-b text-xs">P6</p>
                            <p className="p-0 m-0 text-xs">01:50-01:05</p>
                          </div>
                        </Grid.Col>
                        <Grid.Col
                          className="text-center border-r border-b"
                          span={4}
                        >
                          <div className="p-0 m-0">
                            <p className="text-center border-b text-xs">P</p>
                            <p className="p-0 m-0 text-xs">02:45-02:00</p>
                          </div>
                        </Grid.Col>
                        <Grid.Col
                          className="text-center border-r border-b"
                          span={4}
                        >
                          <div className="p-0 m-0">
                            <p className="text-center border-b text-xs">P8</p>
                            <p className="p-0 m-0 text-xs">03:30-02:45</p>
                          </div>
                        </Grid.Col>
                      </Grid>
                    </Table.Td>
                  </Table.Tr>
                  {days.map((day) => (
                    <Table.Tr>
                      <Table.Th>{day.name}</Table.Th>
                      <Table.Td>
                        <Grid columns={32} align="flex-start">
                          {day.slot.map((slot) => (
                            <Grid.Col className="border-r border-b" span={4}>
                              {slot.label}
                            </Grid.Col>
                          ))}
                        </Grid>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Registration;
