import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRegisteredSchadule } from "../../api/Users/usersApi";

/**
 * يحوّل response بتاع /registration/registered-schedule
 * للشكل اللي StudentTimetable محتاجه.
 */
const mapApiScheduleToTimetableData = (apiResponse) => {
  const rows = apiResponse?.data ?? apiResponse ?? [];
  if (!Array.isArray(rows)) return [];

  return rows
    .map((item) => {
      const cg = item?.CourseGroup;
      const course = cg?.Course;
      const prof = cg?.Professor;
      const schedules = cg?.GroupSchedules ?? [];

      const schedule = schedules
        .map((s) => ({
          day: s?.DayOfWeek,
          time: s?.TimePeriod?.PeriodName,
          room: s?.Room,
        }))
        .filter((x) => x.day && x.time);

      // Dedup day+time
      const unique = [];
      const seen = new Set();
      for (const s of schedule) {
        const k = `${s.day}-${s.time}`;
        if (!seen.has(k)) {
          seen.add(k);
          unique.push(s);
        }
      }

      return {
        groupId: item?.GroupID,
        courseCode: course?.CourseCode ?? "",
        courseName: course?.CourseName ?? "",
        groupNumber: cg?.GroupNumber ?? "",
        professorName: prof?.ProfessorName ?? "",
        room: unique?.[0]?.room ?? "",
        schedule: unique.map(({ day, time }) => ({ day, time })),
      };
    })
    .filter((c) => c.courseCode && c.schedule?.length);
};

export const useRegisteredSchedule = () => {
  const query = useQuery({
    queryKey: ["registered-schedule"],
    queryFn: getRegisteredSchadule,
    staleTime: 1000 * 60 * 10, // 10 min
    gcTime: 1000 * 60 * 30, // 30 min
    refetchOnWindowFocus: false,
    // Example: Disable fetching until the component is mounted or refetch is needed
    enabled: true, // You can set this to false during specific conditions
  });

  const timetableData = useMemo(() => {
    // ✅ أثناء اللودينج ممنوع أي داتا ستاتيك تظهر
    if (query.isLoading) return [];
    return mapApiScheduleToTimetableData(query.data);
  }, [query.isLoading, query.data]);

  return {
    timetableData,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch, // سيتم تحديث الجدول بعد استدعاء هذه الدالة
  };
};
