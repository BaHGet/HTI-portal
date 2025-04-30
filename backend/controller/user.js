import students from '../model/user'; 

const getAllStudent = async (req, res) => {
    try {
        res.status(200).json({ success: true, data: students });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Something went wrong", error });
    }
};

const getStudentById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const student = students.find(s => s.id === id);

        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        res.status(200).json({ success: true, data: student });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Something went wrong", error });
    }
};

module.exports = { getAllStudent, getStudentById};
