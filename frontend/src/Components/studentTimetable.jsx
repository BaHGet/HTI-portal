import { Table2, Download, Check } from "lucide-react";
import {
  Card,
  Text,
  Button,
  Group,
  Box,
  ScrollArea,
  Table,
  Flex,
  LoadingOverlay,
} from "@mantine/core";
import { useState, useRef, useMemo } from "react";
import * as htmlToImage from "html-to-image";

import { useRegisteredSchedule } from "../hooks/queries/use-registered-schedule.js";
import { generateMergedMap, getColor } from "../utils/timetable";

const days = ["السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء"];

const periods = [
  { label: "P1", start: "09:00", end: "09:45" },
  { label: "P2", start: "09:45", end: "10:30" },
  { label: "P3", start: "10:30", end: "11:15" },
  { label: "P4", start: "11:15", end: "12:00" },
  { label: "P5", start: "12:00", end: "12:45" },
  { label: "P6", start: "12:45", end: "01:30" },
  { label: "P7", start: "01:30", end: "02:15" },
  { label: "P8", start: "02:15", end: "03:00" },
];

export const StudentTimetable = () => {
  const cardRef = useRef(null);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const { timetableData, isLoading, isFetching } = useRegisteredSchedule();

  const mergedMap = useMemo(
    () => generateMergedMap(timetableData),
    [timetableData]
  );

  const downloadImage = () => {
    if (cardRef.current === null) return;

    htmlToImage
      .toPng(cardRef.current, { quality: 1 })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "schedule.png";
        link.href = dataUrl;
        link.click();

        setIsDownloaded(true);
        setTimeout(() => setIsDownloaded(false), 2000);
      })
      .catch((err) => console.error("Error generating image", err));
  };

  const overlayVisible = isLoading || isFetching;

  return (
    <Card shadow="sm" radius="md" w="100%" h="100%">
      <Box pos="relative">
        <LoadingOverlay
          visible={overlayVisible}
          zIndex={2000}
          overlayProps={{ blur: 18, opacity: 0.55 }}
        />

        <Flex
          align={"center"}
          justify="space-between"
          px={5}
          mb={10}
          direction={{ base: "column", sm: "row" }}
          gap="sm"
        >
          <Group>
            <Table2 size={22} color="#BBB" />
            <Text c="dimmed" fw={400} fz="lg" align="start" pr={0} mb={0}>
              الجدول الدراسي الحالي
            </Text>
          </Group>

          <Group
            gap="sm"
            justify={{ base: "center", sm: "flex-end" }}
            w={{ base: "100%", sm: "auto" }}
          >
            <Button
              leftSection={<Download size={14} />}
              variant="filled"
              color="teal"
            >
              تحميل كارت التسجيل
            </Button>

            <Button
              leftSection={
                isDownloaded ? (
                  <Check size={16} className="animate-pulse" color="#FFF" />
                ) : (
                  <Download size={16} color="#FFF" />
                )
              }
              variant="filled"
              color={isDownloaded ? "cyan" : "blue"}
              onClick={downloadImage}
              disabled={overlayVisible}
            >
              {isDownloaded ? "تم التحميل" : "تحميل الجدول"}
            </Button>
          </Group>
        </Flex>

        <div className="flex w-full border-1 border-[#BBB] mb-3 p-0"></div>

        <div ref={cardRef}>
          <ScrollArea>
            <Table
              withColumnBorders
              withRowBorders
              withTableBorder
              highlightOnHover={false}
              style={{ minWidth: "700px" }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: "center",
                      border: "1px solid #ccc",
                      background: "#f1f3f5",
                      minWidth: "70px",
                    }}
                  >
                    اليوم
                  </th>

                  {periods.map((p) => (
                    <th
                      key={p.label}
                      style={{
                        textAlign: "center",
                        border: "1px solid #ccc",
                        background: "#fff",
                        minWidth: "75px",
                      }}
                    >
                      {p.label}
                      <br />
                      <Text size="xs">
                        {p.start} - {p.end}
                      </Text>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {days.map((day, dayIndex) => {
                  const dayCode = `D${dayIndex + 1}`;

                  return (
                    <tr key={day}>
                      <td
                        style={{
                          background: "#f1f3f5",
                          fontWeight: "bold",
                          textAlign: "center",
                          border: "1px solid #ccc",
                        }}
                      >
                        {day}
                      </td>

                      {periods.map((p, idx) => {
                        const key = `${dayCode}-${idx + 1}`;

                        if (mergedMap[key]) {
                          const { colSpan, course } = mergedMap[key];

                          return (
                            <td
                              key={p.label}
                              colSpan={colSpan}
                              style={{
                                background: getColor(course.courseCode),
                                position: "relative",
                                textAlign: "center",
                                fontWeight: "bold",
                                height: "64px",
                                border: "1px solid #ccc",
                                padding: 0,
                              }}
                            >
                              <Text
                                size="xs"
                                style={{
                                  position: "absolute",
                                  top: 4,
                                  left: 6,
                                  color: "#333",
                                }}
                              >
                                {course.room}
                              </Text>

                              <Text
                                size="xs"
                                style={{
                                  position: "absolute",
                                  top: 4,
                                  right: 6,
                                  color: "#333",
                                }}
                              >
                                {course.courseCode}
                              </Text>

                              <Box
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  height: "100%",
                                }}
                              >
                                <Text size="sm" style={{ fontWeight: 600 }}>
                                  {course.courseName}
                                </Text>
                              </Box>

                              <Text
                                size="xs"
                                c="dimmed"
                                style={{
                                  position: "absolute",
                                  bottom: 4,
                                  right: 6,
                                }}
                              >
                                {course.professorName}
                              </Text>
                            </td>
                          );
                        }

                        const merged = Object.keys(mergedMap)
                          .filter((k) => k.startsWith(dayCode))
                          .some((k) => {
                            const start = parseInt(k.split("-")[1], 10);
                            const span = mergedMap[k].colSpan;
                            return idx + 1 > start && idx + 1 < start + span;
                          });

                        if (merged) return null;

                        return (
                          <td
                            key={p.label}
                            style={{
                              height: "64px",
                              border: "1px solid #ccc",
                              background: "#fff",
                            }}
                          />
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </ScrollArea>
        </div>
      </Box>
    </Card>
  );
};

export default StudentTimetable;
