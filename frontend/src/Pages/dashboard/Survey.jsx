import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Text,
  Group,
  Radio,
  RadioGroup,
  Stack,
  Divider,
  Loader,
  Alert,
  Textarea,
  Card,
  Flex,
} from "@mantine/core";
import { getSubjects, getSurveyQuestions, submitSurveyAnswers } from "../../Api/Users/usersApi";

const SurveyPage = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState();
  const [btnLoading, setbtnLoading] = useState();
  const [currentSurvey, setCurrentSurvey] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [enrollmentID, setEnrollmentID] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchServaiesData = async () => {
    try {
      setLoading(true);
      const response = await getSubjects(); // استدعاء الـ API
      setSurveys(response.data); // تخزين البيانات عند تحميلها
      setLoading(false); // عند الانتهاء من التحميل نقوم بتعيين الـ loading إلى false
    } catch (error) {
      setLoading(false);
      console.error("Error fetching Subject data:", error);
    }
  };
  // محاكاة جلب البيانات من API
  useEffect(() => {
      fetchServaiesData();
    }, []);

  const handleStartSurvey = (EnrollmentID) => {
    const fetchQuestions = async () => {
      try {
        setbtnLoading(true);
        const response = await getSurveyQuestions(EnrollmentID);
        setCurrentSurvey(response.data);
        setbtnLoading(false);
        setEnrollmentID(EnrollmentID);
        setIsModalOpen(true);
      } catch (error) {
        setbtnLoading(false);
        alert("لقد قمت بالإجابة على هذا الاستبيان مسبقاً.");
        console.error("Error fetching survey questions:", error);
      }
    };
    fetchQuestions();
  };

  const handleAnswerChange = (questionID, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionID]: value,
    }));
  };

  const handleSubmit = () => {
    // التأكد من أن الطالب قد أجاب على جميع الأسئلة
    const allAnswered = Object.keys(currentSurvey).every((key) =>
      currentSurvey[key].every(
        (question) => answers[question.QuestionID] !== undefined
      )
    );

    if (!allAnswered) {
      alert("الرجاء الإجابة على جميع الأسئلة.");
      return;
    }

    // تحويل الإجابات إلى الشكل المطلوب:
    const formattedAnswers = [
      ...currentSurvey.Course.map((question) => ({
        questionId: question.QuestionID,
        score: answers[question.QuestionID] || null, //  null in case no answer is selected
      })),
      ...currentSurvey.Professor.map((question) => ({
        questionId: question.QuestionID,
        score: answers[question.QuestionID] || null,
      })),
      ...currentSurvey.Assistant.map((question) => ({
        questionId: question.QuestionID,
        score: answers[question.QuestionID] || null,
      })),
      ...currentSurvey.General.map((question) => ({
        questionId: question.QuestionID,
        text: answers[question.QuestionID] || "", // Store feedback as text
      })),
    ];

    // إرسال الإجابات
    console.log("Formatted Answers:", formattedAnswers);

    // إرسال البيانات إلى الـ API
    const submittAnswers = async (answer, EnrollmentID) => {
      try {
        setbtnLoading(true);
        await submitSurveyAnswers(EnrollmentID, answer);
        setbtnLoading(false);
        setIsModalOpen(false);
        setAnswers([]);
        setEnrollmentID(0);
        fetchServaiesData();
      } catch (error) {
        console.error("Error submitting survey answers:", error);
      }
    };

    submittAnswers(formattedAnswers, enrollmentID);
  };


  const tableRows = surveys.map(
    (survey) =>
      survey.Status !== "Withdrawal" && (
        <Table.Tr key={survey.EnrollmentID}>
          <Table.Td style={{ textAlign: "center" }}>
            <Button
              size="sm"
              onClick={() => handleStartSurvey(survey.EnrollmentID)}
              disabled={survey.isEvaluated}
            >
              {survey.isEvaluated ? (
                "تمت الإجابة"
              ) : btnLoading ? (
                <Loader size="sm" color="rgba(255, 255, 255, 1)" />
              ) : (
                "ابدأ الاستبيان"
              )}
            </Button>
          </Table.Td>
          <Table.Td style={{ textAlign: "center" }}>
            {survey.CourseCode}
          </Table.Td>
          <Table.Td style={{ textAlign: "center" }}>
            {survey.CourseName}
          </Table.Td>
          <Table.Td style={{ textAlign: "center" }}>
            {survey.GroupNumber}
          </Table.Td>
        </Table.Tr>
      )
  );

  return (
    <div>
      <h1 className="title py-3">استبيانات المواد</h1>
      {loading ? (
        <div className="h-full flex justify-center items-center mt-30">
          <Loader size="xl" />
        </div>
      ) : (
        <Card shadow="sm" radius="md" padding="lg" withBorder>
          <Table striped highlightOnHover withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ textAlign: "center" }}>
                 
                </Table.Th>
                <Table.Th style={{ textAlign: "center" }}>
                 كود المادة
                </Table.Th>
                <Table.Th style={{ textAlign: "center" }}>
                  اسم المادة
                </Table.Th>
                <Table.Th style={{ textAlign: "center" }}>
                  رقم المجموعة
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{tableRows}</Table.Tbody>
          </Table>
        </Card>
      )}

      <Modal
        opened={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setAnswers([]);
          setEnrollmentID(0);
        }}
        title="ابدأ الاستبيان"
        size="full-screen"
        dir="rtl"
        closeOnClickOutside={false} // عدم إغلاق الـ Modal عند الضغط خارجها
      >
        {currentSurvey ? (
          <Stack>
            <Divider my="sm" label="المادة العلمية" />
            {currentSurvey.Course.map((question) => (
              <div key={question.QuestionID}>
                <Text>
                  {question.QuestionID}. {question.QuestionText}
                </Text>
                <RadioGroup
                  value={answers[question.QuestionID]}
                  onChange={(value) =>
                    handleAnswerChange(question.QuestionID, value)
                  }
                  name={`course_${question.QuestionID}`}
                >
                  <Flex
                    my={10}
                    gap="lg"
                    align={"center"}
                    justify={"space-between"}
                  >
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <Radio
                        key={rating}
                        value={rating.toString()}
                        label={rating}
                      />
                    ))}
                  </Flex>
                </RadioGroup>
              </div>
            ))}

            <Divider my="sm" label="مدرس المادة" />

            {currentSurvey.Professor.map((question) => (
              <div key={question.QuestionID}>
                <Text>
                  {question.QuestionID}. {question.QuestionText}
                </Text>
                <RadioGroup
                  value={answers[question.QuestionID]}
                  onChange={(value) =>
                    handleAnswerChange(question.QuestionID, value)
                  }
                  name={`professor_${question.QuestionID}`}
                >
                  <Flex
                    my={10}
                    gap="lg"
                    align={"center"}
                    justify={"space-between"}
                  >
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <Radio
                        key={rating}
                        value={rating.toString()}
                        label={rating}
                      />
                    ))}
                  </Flex>
                </RadioGroup>
              </div>
            ))}

            <Divider my="sm" label="المدرس المساعد" />

            {currentSurvey.Assistant.map((question) => (
              <div key={question.QuestionID}>
                <Text>
                  {question.QuestionID}. {question.QuestionText}
                </Text>
                <RadioGroup
                  value={answers[question.QuestionID]}
                  onChange={(value) =>
                    handleAnswerChange(question.QuestionID, value)
                  }
                  name={`assistant_${question.QuestionID}`}
                >
                  <Flex
                    my={10}
                    gap="lg"
                    align={"center"}
                    justify={"space-between"}
                  >
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <Radio
                        key={rating}
                        value={rating.toString()}
                        label={rating}
                      />
                    ))}
                  </Flex>
                </RadioGroup>
              </div>
            ))}

            <Divider my="sm" />

            {currentSurvey.General.map((question) => (
              <div key={question.QuestionID}>
                <Text>
                  {question.QuestionID}. {question.QuestionText}
                </Text>
                <Textarea
                  value={answers[question.QuestionID] || ""}
                  onChange={(e) =>
                    handleAnswerChange(question.QuestionID, e.target.value)
                  }
                  placeholder="أدخل ملاحظاتك هنا"
                />
              </div>
            ))}

            <Button color="green" onClick={handleSubmit} mt="sm">
              {btnLoading ? (
                <Loader size="sm" color="rgba(255, 255, 255, 1)" />
              ) : (
                "إرسال الاستبيان"
              )}
            </Button>
          </Stack>
        ) : (
          <Alert color="red">لا توجد أسئلة للاستبيان</Alert>
        )}
      </Modal>
    </div>
  );
};

export default SurveyPage;
