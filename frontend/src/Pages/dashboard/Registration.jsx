import React, { useState, useEffect } from "react";
import { PlusCircle, Trash, RefreshCcw, Download } from "lucide-react";
import { Table, Grid, Button, Modal, Loader } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  getAvaliableSubjects,
  getRegisteredSchadule,
  registerSubject,
  dropSubject,
} from "../../Api/Users/usersApi";

const Registration = () => {
  const allowedCreditHours = 21;

  // Modal state
  const [opened, { open, close }] = useDisclosure(false);
  const [modalMessage, setModalMessage] = useState("");

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  // Available and registered courses
  const [availableGroups, setAvailableGroups] = useState([]);
  const [registeredSchedule, setRegisteredSchedule] = useState([]);

  // Loading states
  const [isLoadingAvailable, setIsLoadingAvailable] = useState(false);
  const [isLoadingRegistered, setIsLoadingRegistered] = useState(false);

  // Column visibility
  const [visibleColumns, setVisibleColumns] = useState({
    code: true,
    name: true,
    group: true,
    days: true,
    time: true,
    seats: true,
    credit: true,
  });

  // Timetable slots and days
  const slotsTemplate = Array.from({ length: 8 }, (_, idx) => ({
    id: idx + 1,
    label: "",
    colour: "gray",
  }));

  const [days, setDays] = useState([
    { id: 1, name: "السبت", slots: [...slotsTemplate] },
    { id: 2, name: "الأحد", slots: [...slotsTemplate] },
    { id: 3, name: "الإثنين", slots: [...slotsTemplate] },
    { id: 4, name: "الثلاثاء", slots: [...slotsTemplate] },
    { id: 5, name: "الأربعاء", slots: [...slotsTemplate] },
  ]);

  // -------------------------------
  // Fetch available groups from backend
  // -------------------------------
  const handleRefreshButton = async () => {
    setIsLoadingAvailable(true);
    try {
      const response = await getAvaliableSubjects();
      setAvailableGroups(response.data);
    } catch (error) {
      console.error("Error fetching available subjects:", error);
      setModalMessage("حدث خطأ أثناء جلب المواد المتاحة.");
      open();
    } finally {
      setIsLoadingAvailable(false);
    }
  };

  // -------------------------------
  // Fetch registered schedule from backend
  // -------------------------------
  const fetchRegisteredSchedule = async () => {
    setIsLoadingRegistered(true);
    try {
      const response = await getRegisteredSchadule();

      console.log("REGISTERED RAW DATA:", response.data);

      const formatted = response.data.map((subject) => {
        const group = subject.CourseGroup;

        return {
          groupId: subject.GroupID,
          courseCode: group.Course.CourseCode || "-",
          courseName: group.Course.CourseName || "-",
          creditHours: group.Course.CreditHours || "-",
          groupNumber: group.GroupNumber || "-",
          professorName: group.Professor.ProfessorName || "-",
          schedule: Array.isArray(group.GroupSchedules)
            ? group.GroupSchedules
            : [],
        };
      });
      console.log("FORMATTED REGISTERED DATA:", formatted);
      setRegisteredSchedule(formatted);
    } catch (error) {
      console.error("Error fetching registered schedule:", error);
      setModalMessage("حدث خطأ أثناء جلب المواد المسجلة.");
      open();
    } finally {
      setIsLoadingRegistered(false);
    }
  };


  // -------------------------------
  // Fetch both data on component mount
  // -------------------------------
  useEffect(() => {
    handleRefreshButton();
    fetchRegisteredSchedule();
  }, []);

  // -------------------------------
  // Filter available groups by search term
  // -------------------------------
  const filteredGroups = availableGroups.filter(
    (g) =>
      g.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // -------------------------------
  // Calculate total registered credits
  // -------------------------------
  const totalRegisteredCredits = registeredSchedule.reduce(
    (sum, c) => sum + c.creditHours,
    0
  );

  // -------------------------------
  // Convert schedule array to string for display
  // -------------------------------
  const renderSchedule = (schedule) => {
    if (!schedule || schedule.length === 0) return "-";
    return schedule.map((s) => `${s.day} ${s.time}`).join(" / ");
  };

  // -------------------------------
  // Update visual timetable based on registered courses
  // -------------------------------
  const updateTimetable = () => {
    // const newDays = days.map((day) => ({
    //   ...day,
    //   slots: day.slots.map((slot) => ({ ...slot, label: "", colour: "gray" })),
    // }));

    // registeredSchedule.forEach((course) => {
    //   if (Array.isArray(course.schedule)) {
    //     course.schedule.forEach((s) => {
    //       if (!s?.day || !s?.time) {
    //         console.warn("Invalid schedule entry:", s);
    //         return;
    //       }

    //       const dayIndex = parseInt(s.day.replace("D", "")) - 1;
    //       const slotIndex = parseInt(s.time.replace("P", "")) - 1;

    //       if (newDays[dayIndex] && newDays[dayIndex].slots[slotIndex]) {
    //         newDays[dayIndex].slots[slotIndex].label = course.courseCode;
    //         newDays[dayIndex].slots[slotIndex].colour = "lightblue";
    //       }
    //     });
    //   }
    // });

    // setDays(newDays);
  };


  // Update timetable whenever registeredSchedule changes
  useEffect(() => {
    updateTimetable();
  }, [registeredSchedule]);

  // -------------------------------
  // Handle Add (register subject) API call
  // -------------------------------
  const handleAdd = async (group) => {
    if (totalRegisteredCredits + group.creditHours > allowedCreditHours) {
      setModalMessage("لقد تخطيت الحد الأقصى لعدد الساعات المسموح به للتسجيل");
      open();
      return;
    }

    try {
      await registerSubject(group.groupId);
      await handleRefreshButton();
      await fetchRegisteredSchedule();
    } catch (error) {
      console.error("Error registering subject:", error);
      setModalMessage("حدث خطأ أثناء إضافة المادة.");
      open();
    }
  };

  // -------------------------------
  // Handle Remove (drop subject) API call
  // -------------------------------
  const handleRemove = async (group) => {
    try {
      await dropSubject(group.groupId);
      await handleRefreshButton();
      await fetchRegisteredSchedule();
    } catch (error) {
      console.error("Error dropping subject:", error);
      setModalMessage("حدث خطأ أثناء حذف المادة.");
      open();
    }
  };

  // -------------------------------
  // Toggle table column visibility
  // -------------------------------
  const toggleColumn = (col) => {
    setVisibleColumns((prev) => ({ ...prev, [col]: !prev[col] }));
  };

  // -------------------------------
  // Render Available Groups Table Rows
  // -------------------------------
  const registerTableRows = filteredGroups.map((element, idx) => (
    <Table.Tr key={idx}>
      <Table.Td className="text-center">
        <button
          className={element.availableSeats?"text-green-700 hover:text-green-500 cursor-pointer":"text-gray-400 cursor-not-allowed"}
          onClick={element.availableSeats?() => handleAdd(element):null}
        >
          <PlusCircle size={20} />
        </button>
      </Table.Td>

      {visibleColumns.code && (
        <Table.Td className="text-center">{element.courseCode}</Table.Td>
      )}
      {visibleColumns.name && (
        <Table.Td className="text-center">{element.courseName}</Table.Td>
      )}
      {visibleColumns.group && (
        <Table.Td className="text-center">
          {element.groupNumber} ({element.professorName})
        </Table.Td>
      )}
      {visibleColumns.days && (
        <Table.Td className="text-center">
          {renderSchedule(element.schedule)}
        </Table.Td>
      )}
      {visibleColumns.time && (
        <Table.Td className="text-center">
          {renderSchedule(element.schedule)}
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

  // -------------------------------
  // Render Registered Courses Table Rows
  // -------------------------------
  const registeredSubjectsRows = registeredSchedule.map((element, idx) => (
    <Table.Tr key={idx}>
      <Table.Td className="text-center">
        <button
          className="text-gray-600 hover:text-red-500 cursor-pointer"
          onClick={() => handleRemove(element)}
        >
          <Trash size={20} />
        </button>
      </Table.Td>
      <Table.Td className="text-center">{element.courseCode}</Table.Td>
      <Table.Td className="text-center">{element.courseName}</Table.Td>
      <Table.Td className="text-center">
        {element.groupNumber} ({element.professorName})
      </Table.Td>
    </Table.Tr>
  ));

  // -------------------------------
  // Timetable Component
  // -------------------------------
  const Timetable = () => (
    <Table variant="vertical" layout="auto" withTableBorder>
      <Table.Tbody>
        <Table.Tr>
          <Table.Th w={70}></Table.Th>
          <Table.Td>
            <Grid columns={32} align="flex-start">
              {slotsTemplate.map((slot) => (
                <Grid.Col key={slot.id} className="border-r border-b" span={4}>
                  <div className="text-center text-xs">{`P${slot.id}`}</div>
                </Grid.Col>
              ))}
            </Grid>
          </Table.Td>
        </Table.Tr>

        {days.map((day) => (
          <Table.Tr key={day.id}>
            <Table.Th>{day.name}</Table.Th>
            <Table.Td>
              <Grid columns={32} align="flex-start">
                {day.slots.map((slot) => (
                  <Grid.Col
                    key={slot.id}
                    className="border-r border-b"
                    span={4}
                  >
                    <div
                      className="text-center text-xs"
                      style={{ backgroundColor: slot.colour }}
                    >
                      {slot.label}
                    </div>
                  </Grid.Col>
                ))}
              </Grid>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );

  // -------------------------------
  // Render Main Component
  // -------------------------------
  return (
    <>
      {/* Modal */}
      <Modal opened={opened} onClose={close} withCloseButton={false}>
        <div className="text-center">{modalMessage}</div>
      </Modal>

      {/* Main Content */}
      <div className="text-xl font-bold mb-1">تسجيل المقررات</div>

      <div className="flex flex-col h-[85vh] gap-4 overflow-hidden">
        {/* Available Courses Table */}
        <div className="card p-0 rounded-xl h-[65%] flex flex-col overflow-hidden">
          <div className="flex flex-wrap pt-4 px-4 justify-between items-center">
            <div className="flex flex-wrap items-center gap-4">
              <Button
                onClick={handleRefreshButton}
                rightSection={<RefreshCcw />}
                className="ml-2 px-0"
                color="blue"
              >
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

            <div className="flex flex-wrap gap-4 pt-2">
              <div>Allowed Credits: {allowedCreditHours}</div>
              <div>Registered Credits: {totalRegisteredCredits}</div>
              <div>
                Remaining Credits: {allowedCreditHours - totalRegisteredCredits}
              </div>
            </div>
          </div>

          {/* Column toggles */}
          <div className="flex flex-wrap gap-3 px-4 py-1 border-t">
            {Object.keys(visibleColumns).map((col) => (
              <label key={col} className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={visibleColumns[col]}
                  onChange={() => toggleColumn(col)}
                />
                {col === "code"
                  ? "Course Code"
                  : col === "name"
                  ? "Course Name"
                  : col === "group"
                  ? "Group (Professor)"
                  : col === "days"
                  ? "Days"
                  : col === "time"
                  ? "Time"
                  : col === "seats"
                  ? "Seats"
                  : "Credit Hours"}
              </label>
            ))}
          </div>

          {/* Table body */}
          <div className="flex-1 overflow-auto">
            {isLoadingAvailable ? (
              <div className="flex justify-center items-center h-full text-gray-600">
                <Loader size="sm" className="mr-2" /> جاري تحديث بيانات
                الجدول...
              </div>
            ) : (
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
                    <Table.Th>Add</Table.Th>
                    {visibleColumns.code && <Table.Th>Course Code</Table.Th>}
                    {visibleColumns.name && <Table.Th>Course Name</Table.Th>}
                    {visibleColumns.group && (
                      <Table.Th>Group (Professor)</Table.Th>
                    )}
                    {visibleColumns.days && <Table.Th>Days</Table.Th>}
                    {visibleColumns.time && <Table.Th>Time</Table.Th>}
                    {visibleColumns.seats && <Table.Th>Seats</Table.Th>}
                    {visibleColumns.credit && <Table.Th>Cr.Hrs</Table.Th>}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{registerTableRows}</Table.Tbody>
              </Table>
            )}
          </div>
        </div>

        {/* Registered Courses + Timetable */}
        <div className="grid grid-cols-2 gap-4 h-[35%] overflow-hidden">
          {/* Registered Courses */}
          <div className="card p-0 rounded-xl flex flex-col overflow-auto">
            <div className="text-center align-middle p-1 font-bold border-b flex justify-between items-center">
              <div className="pr-4">Registered Courses</div>
              <Button
                rightSection={<Download />}
                className="ml-2 px-0"
                variant="outline"
                color="red"
                size="xs"
              >
                <p>Registration Card</p>
              </Button>
            </div>
            <div className="overflow-x-auto flex-1">
              {isLoadingRegistered ? (
                <div className="flex justify-center items-center h-full text-gray-600">
                  <Loader size="sm" className="mr-2" /> Loading registered
                  courses...
                </div>
              ) : (
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
                      <Table.Th>Remove</Table.Th>
                      <Table.Th>Course Code</Table.Th>
                      <Table.Th>Course Name</Table.Th>
                      <Table.Th>Group (Professor)</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>{registeredSubjectsRows}</Table.Tbody>
                </Table>
              )}
            </div>
          </div>

          {/* Student Timetable */}
          <div className="card p-0 rounded-xl flex flex-col overflow-auto">
            <div className="text-center align-middle p-1 font-bold border-b flex justify-between items-center">
              <div className="pr-4">Student Timetable</div>
              <Button
                rightSection={<Download />}
                className="ml-2 px-0"
                color="green"
                variant="outline"
                size="xs"
              >
                <p>Download Timetable</p>
              </Button>
            </div>
            <div className="p-0 pt-0 overflow-x-auto flex-1">
              <Timetable />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Registration;
