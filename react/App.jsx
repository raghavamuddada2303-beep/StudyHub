import { useState } from "react";
import Header from "./components/Header.jsx";
import DepartmentGrid from "./components/DepartmentGrid.jsx";
import SemesterPicker from "./components/SemesterPicker.jsx";
import SubjectList from "./components/SubjectList.jsx";
import SubjectDetail from "./components/SubjectDetail.jsx";
import SearchResults from "./components/SearchResults.jsx";
import { Loading, Empty } from "./components/States.jsx";
import { DEPARTMENTS, SEMESTERS } from "./data/departments.js";
import { useRoute } from "./hooks/useRoute.js";
import { useCurriculum } from "./hooks/useCurriculum.js";

export default function App() {
  const [deptId, semRaw, subjectId] = useRoute();
  const [query, setQuery] = useState("");
  const { loading, error, data, meta } = useCurriculum();
  const dept = DEPARTMENTS.find((d) => d.id === deptId);
  const sem = Number(semRaw);

  let view;
  if (loading) view = <Loading />;
  else if (error) view = <Empty title="Couldn’t load resources">Reload the page. If it keeps failing, check the data file.</Empty>;
  else if (query.trim()) view = <SearchResults query={query.trim()} data={data} />;
  else if (!deptId) view = <DepartmentGrid />;
  else if (!dept) view = <Empty title="Department not found" action={<a className="btn" href="#/">Back to departments</a>} />;
  else if (!semRaw) view = <SemesterPicker dept={dept} />;
  else if (!SEMESTERS.includes(sem)) view = <Empty title="Semester not found">Semesters run from 1 to 8.</Empty>;
  else {
    const subjects = data?.[dept.id]?.[sem] ?? [];
    view = subjectId
      ? <SubjectDetail info={meta?.[dept.id]?.[sem]} dept={dept} sem={sem} subject={subjects.find((s) => s.id === subjectId)} />
      : <SubjectList info={meta?.[dept.id]?.[sem]} dept={dept} sem={sem} subjects={subjects} />;
  }

  return (
    <>
      <Header onSearch={setQuery} />
      <main className="container">{view}</main>“Learn today, lead tomorrow. Every concept you master brings you one step closer to your dreams.” ✨
      <footer className="container foot"></footer>
    </>
  );
}
