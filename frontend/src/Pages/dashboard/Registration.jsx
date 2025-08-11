import React, { useState, useMemo } from "react";
import { registableCourses } from "../../constants";
import { PlusCircle, Trash, RefreshCcw } from "lucide-react";

const Registration = () => {
  const allowedCreditHours = 18;

  const allGroups = useMemo(() => {
    return registableCourses.flatMap((course) =>
      course.groups.map((group) => ({
        ...course,
        ...group,
      }))
    );
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
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
    if (sameCourseOtherGroup) {
      alert("لا يمكن إضافة نفس المادة في مجموعة أخرى");
      return;
    }

    // check credit hours limit
    if (totalRegisteredCredits + group.creditHours > allowedCreditHours) {
      alert("لقد تخطيت الحد المسموح به للتسجيل");
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

  return (
    <>
      <div className="text-xl font-bold mb-2">تسجيل المقررات</div>

      <div className="grid grid-cols-2 h-[85vh] gap-4">
        {/* الجدول الأول */}
        <div className="card p-0 rounded-xl flex flex-col">
          <div className="flex justify-between pt-4 px-4">
            <button className="btn btn-primary gap-2 cursor-pointer">
              <p>تحديث</p>
              <RefreshCcw />
            </button>
            <div className="input w-40">
              <input
                type="text"
                placeholder="بحث ..."
                className="w-full bg-transparent text-slate-900 outline-0 placeholder:text-slate-500 dark:text-slate-50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Checkbox التحكم في الأعمدة */}
          <div className="flex flex-wrap gap-3 px-4 py-2 border-b">
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
          <div className="overflow-x-auto flex-1">
            <div className="max-h-[calc(85vh-140px)] overflow-y-auto">
              <table className="min-w-full border border-gray-200 text-sm">
                <thead className="bg-slate-200">
                  <tr>
                    <th className="sticky top-0 border-b text-center py-2 bg-slate-200 z-10">
                      إضافة
                    </th>
                    {visibleColumns.code && (
                      <th className="sticky top-0 border-b text-center py-2 bg-slate-200 z-10">
                        كود المادة
                      </th>
                    )}
                    {visibleColumns.name && (
                      <th className="sticky top-0 border-b text-center py-2 bg-slate-200 z-10">
                        اسم المادة
                      </th>
                    )}
                    {visibleColumns.group && (
                      <th className="sticky top-0 border-b text-center py-2 bg-slate-200 z-10">
                        مجموعة
                      </th>
                    )}
                    {visibleColumns.days && (
                      <th className="sticky top-0 border-b text-center py-2 bg-slate-200 z-10">
                        الأيام
                      </th>
                    )}
                    {visibleColumns.time && (
                      <th className="sticky top-0 border-b text-center py-2 bg-slate-200 z-10">
                        التوقيت
                      </th>
                    )}
                    {visibleColumns.seats && (
                      <th className="sticky top-0 border-b text-center py-2 bg-slate-200 z-10">
                        المقاعد
                      </th>
                    )}
                    {visibleColumns.credit && (
                      <th className="sticky top-0 border-b text-center py-2 bg-slate-200 z-10">
                        Cr.Hrs
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredGroups.map((group, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-gray-50 items-center text-center"
                    >
                      <td className="px-1 border-b">
                        <button
                          className="text-gray-600 hover:text-green-500"
                          onClick={() => handleAdd(group)}
                        >
                          <PlusCircle size={20} />
                        </button>
                      </td>
                      {visibleColumns.code && (
                        <td className="px-1 border-b">{group.code}</td>
                      )}
                      {visibleColumns.name && (
                        <td className="px-1 border-b">{group.name}</td>
                      )}
                      {visibleColumns.group && (
                        <td className="px-1 border-b">{group.groupNumber}</td>
                      )}
                      {visibleColumns.days && (
                        <td className="px-1 border-b">
                          {renderDays(group.days)}
                        </td>
                      )}
                      {visibleColumns.time && (
                        <td className="px-1 border-b">
                          {group.timeStart} - {group.timeEnd}
                        </td>
                      )}
                      {visibleColumns.seats && (
                        <td className="px-1 border-b">
                          {group.availableSeats}
                        </td>
                      )}
                      {visibleColumns.credit && (
                        <td className="px-1 border-b">{group.creditHours}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* الجدول الثاني */}
        <div className="grid grid-rows-2 gap-4">
          <div className="card p-0 rounded-xl flex flex-col">
            <div className="p-4 font-bold border-b">المواد المسجلة</div>
            <div className="overflow-x-auto flex-1">
              <div className="max-h-[calc(85vh/2-60px)] overflow-y-auto">
                <table className="min-w-full border border-gray-200 text-sm">
                  <thead className="bg-slate-200">
                    <tr>
                      <th className="sticky top-0 border-b text-center py-2 bg-slate-200 z-10">
                        حذف
                      </th>
                      <th className="sticky top-0 border-b text-center py-2 bg-slate-200 z-10">
                        كود المادة
                      </th>
                      <th className="sticky top-0 border-b text-center py-2 bg-slate-200 z-10">
                        اسم المادة
                      </th>
                      <th className="sticky top-0 border-b text-center py-2 bg-slate-200 z-10">
                        مجموعة
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {registeredCourses.map((group, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 text-center">
                        <td className="px-1 border-b">
                          <button
                            className="text-gray-600 hover:text-red-500"
                            onClick={() => handleRemove(group)}
                          >
                            <Trash size={20} />
                          </button>
                        </td>
                        <td className="px-1 border-b">{group.code}</td>
                        <td className="px-1 border-b">{group.name}</td>
                        <td className="px-1 border-b">{group.groupNumber}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* معلومات الساعات */}
          <div className="card p-4 rounded-xl flex flex-col justify-center items-center gap-2">
            <div>عدد الساعات المسموح به: {allowedCreditHours}</div>
            <div>عدد الساعات المسجلة: {totalRegisteredCredits}</div>
            <div>
              الساعات المتاحة: {allowedCreditHours - totalRegisteredCredits}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Registration;
