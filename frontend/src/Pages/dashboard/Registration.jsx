import React, { useState, useEffect } from "react";
import { PlusCircle, Trash, RefreshCcw, Download } from "lucide-react";
import { Table, Button, Modal, Loader } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  getAvaliableSubjects,
  getRegisteredSchadule,
  registerSubject,
  dropSubject,
} from "../../api/Users/usersApi";
import StudentTimetable from "../../Components/StudentTimetable"; // Import timetable component
import { useMe } from "../../hooks/queries/useMe"; // Hook to get student data
import { useRegisteredSchedule } from "../../hooks/queries/use-registered-schedule.js";



const Registration = () => {
  const { timetableData, isLoading, refetch } = useRegisteredSchedule();

  const [studentData, setStudentData] = useState(null);
  const { data: meResponse } = useMe(); // Get cached data for the student
  const [allowedCreditHours, setAllowedCreditHours] = useState(0); // Default to 21 hours
  const [update, setUpdate] = useState(0);

  // Modal state for showing timetable
  const [opened, setOpened] = useState(false);
  const [openedModal, setOpenedModal] = useState(false); // New modal state
  const [modalMessage, setModalMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [availableGroups, setAvailableGroups] = useState([]);
  const [registeredSchedule, setRegisteredSchedule] = useState([]);
  const [isLoadingAvailable, setIsLoadingAvailable] = useState(false);
  const [isLoadingRegistered, setIsLoadingRegistered] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    code: true,
    name: true,
    group: true,
    days: true,
    time: true,
    seats: true,
    credit: true,
  });

  useEffect(() => {
    if (meResponse) {
      const gpa = parseFloat(meResponse?.data?.gpa || 0);
      if (gpa >= 3) {
        setAllowedCreditHours(21);
      } else if (gpa >= 2) {
        setAllowedCreditHours(18);
      } else {
        setAllowedCreditHours(14);
      }
    }
    handleRefreshButton();
    fetchRegisteredSchedule();
  }, [meResponse]);

  // Fetch available subjects
  const handleRefreshButton = async () => {
    setIsLoadingAvailable(true);
    try {
      const response = await getAvaliableSubjects();
      setAvailableGroups(response.data); // Set available groups (courses)
    } catch (error) {
      console.error("Error fetching available subjects:", error);
      setModalMessage("حدث خطأ أثناء جلب المواد المتاحة.");
      open();
    } finally {
      setIsLoadingAvailable(false);
    }
  };

  // Fetch registered schedule
  const fetchRegisteredSchedule = async () => {
    setIsLoadingRegistered(true);
    try {
      const response = await getRegisteredSchadule();
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
      setRegisteredSchedule(formatted); // Set registered schedule (student's timetable)
    } catch (error) {
      console.error("Error fetching registered schedule:", error);
      setModalMessage("حدث خطأ أثناء جلب المواد المسجلة.");
      open();
    } finally {
      setIsLoadingRegistered(false);
    }
  };

  // Filter available courses by search
  const filteredGroups = availableGroups.filter(
    (g) =>
      g.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total registered credits
  const totalRegisteredCredits = registeredSchedule.reduce(
    (sum, c) => sum + c.creditHours,
    0
  );

  // Render schedule as string
  const renderSchedule = (schedule) => {
    if (!schedule || schedule.length === 0) return "-";
    return schedule.map((s) => `${s.day} ${s.time}`).join(" / ");
  };

  // Add (register subject)
  const handleAdd = async (group) => {
    if (totalRegisteredCredits + group.creditHours > allowedCreditHours) {
      setModalMessage("لقد تخطيت الحد الأقصى لعدد الساعات المسموح به للتسجيل");
      open();
      return;
    }
    try {
      await registerSubject(group.groupId);
      refetch(); // تحديث الجدول بعد إضافة المادة
      await handleRefreshButton();
      await fetchRegisteredSchedule();
    } catch (error) {
      console.error("Error registering subject:", error);
      setModalMessage("حدث خطأ أثناء إضافة المادة.");
      open();
    }
  };

  // Remove (drop subject)
  const handleRemove = async (group) => {
    try {
      await dropSubject(group.groupId);
      refetch(); // تحديث الجدول بعد إضافة المادة
      await handleRefreshButton();
      await fetchRegisteredSchedule();
    } catch (error) {
      console.error("Error dropping subject:", error);
      setModalMessage("حدث خطأ أثناء حذف المادة.");
      open();
    }
  };

  // Table rows for available courses
  const registerTableRows = filteredGroups.map((element, idx) => (
    <Table.Tr key={idx}>
      <Table.Td className="text-center">
        <button
          className={
            element.availableSeats
              ? "text-green-700 hover:text-green-500 cursor-pointer"
              : "text-gray-400 cursor-not-allowed"
          }
          onClick={element.availableSeats ? () => handleAdd(element) : null}
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

  // Table rows for registered courses
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

  // Handle opening timetable modal
  const handleOpenTimetableModal = () => {
    setOpenedModal(true); // Open the modal when clicked
  };

  const handleCloseModal = () => {
    setOpenedModal(false); // Close the modal
  };

  return (
    <>
      {/* Modal for errors or messages */}
      <Modal opened={opened} onClose={close} withCloseButton={false}>
        <div className="text-center">{modalMessage}</div>
      </Modal>

      {/* Modal for Timetable */}
      <Modal
        dir="rtl"
        opened={openedModal}
        onClose={handleCloseModal}
        size="70%"
      >
        <div className="text-center">
          <StudentTimetable timetableData={registeredSchedule} />
        </div>
      </Modal>

      {/* Page Header */}
      <div className="text-xl font-bold mb-1">تسجيل المقررات</div>

      {/* Main Content */}
      <div className="flex flex-col gap-4  overflow-auto">
        {/* Available Courses */}
        <div className="card p-0 rounded-xl flex h-[45vh] flex-col overflow-hidden">
          <div className="flex flex-wrap pt-4 px-4 justify-between items-center gap-2">
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

          {/* Courses Table */}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[40vh] overflow-hidden">
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

          {/* Clickable Timetable */}
          <div
            className="card p-0 rounded-xl flex flex-col timetable-card"
            onClick={handleOpenTimetableModal}
          >
            <div className=" w-full h-full ">
              <StudentTimetable timetableData={registeredSchedule} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Registration;
