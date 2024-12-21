const http = require("http");
const fs = require("fs");

let student = JSON.parse(fs.readFileSync("./student.json"));
let course = JSON.parse(fs.readFileSync("./course.json"));
let department = JSON.parse(fs.readFileSync("./department.json"));

const port = http.createServer((req, res) => {
  let { url, method } = req;
  let setResponse = (code, message) => {
    res.statusCode = code;
    res.end(JSON.stringify(message));
  };
  //add student
  if (url == "/student" && method == "POST") {
    req.on("data", (chunk) => {
      let user = JSON.parse(chunk);
      user.id = student.length + 1;
      user.departmentId = student.length + 1;
      student.push(user);
      fs.writeFileSync("student.json", JSON.stringify(student));
      setResponse(201, { message: "Success" });
    });
    //get all student
  } else if (url == "/student" && method == "GET") {
    setResponse(200, student);
  }
  //Get all students with their department and courses related to the department
  else if (url == "/allstudent" && method == "GET") {
    const AllStudent = student.map((student) => {
      const ALLDepartment = department.find((department) => {
        return department.id == student.departmentId;
      });
      const AllCourse = course.filter((course) => {
        return course.departmentId == student.departmentId;
      });
      delete student.departmentId;
      return {
        ...student,
        Department: ALLDepartment,
        Course: AllCourse,
      };
    });
    setResponse(200, AllStudent);
  }
  //Delete student
  else if (url.startsWith("/student/") && method == "DELETE") {
    let urlId = Number(url.split("/")[2]);
    let index = student.findIndex((student) => student.id == urlId);
    if (index == -1) {
      setResponse(404, { message: "Index Not Found" });
    }
    student.splice(index, 1);
    fs.writeFileSync("student.json", JSON.stringify(student));
    setResponse(200, { message: "Delete" });
  }
  //Update student
  else if (url.startsWith("/student/") && method == "PUT") {
    let urlId = Number(url.split("/")[2]);
    let index = student.findIndex((student) => student.id == urlId);
    if (index == -1) {
      setResponse(404, { message: "Index Not Found" });
    }
    req.on("data", (chunk) => {
      let user = JSON.parse(chunk);
      student[index].name = user.name;
      student[index].email = user.email;
      student[index].password = user.password;
      fs.writeFileSync("student.json", JSON.stringify(student));
      setResponse(200, { message: "Updated" });
    });
  }
  //search for a student by ID
  else if (url.startsWith("/student/") && method == "GET") {
    let urlId = Number(url.split("/")[2]);
    let index = student.findIndex((student) => student.id == urlId);
    if (index == -1) {
      setResponse(404, { message: "Index Not Found" });
    }
    setResponse(200, student[index]);
  }
  //add course
  else if (url == "/course" && method == "POST") {
    req.on("data", (chunk) => {
      let user = JSON.parse(chunk);
      user.id = course.length + 1;
      course.push(user);
      fs.writeFileSync("course.json", JSON.stringify(course));
      setResponse(201, { message: "Success" });
    });
  }
  //delete course
  else if (url.startsWith("/course/") && method == "DELETE") {
    let urlId = Number(url.split("/")[2]);
    let index = course.findIndex((course) => course.id == urlId);
    if (index == -1) {
      setResponse(404, { message: "Index Not Found" });
    }
    course.splice(index, 1);
    fs.writeFileSync("course.json", JSON.stringify(course));
    setResponse(200, { message: "Delete" });
  }
  //Update course
  else if (url.startsWith("/course/") && method == "PUT") {
    let urlId = Number(url.split("/")[2]);
    let index = course.findIndex((course) => course.id == urlId);
    if (index == -1) {
      setResponse(404, { message: "Index Not Found" });
    }
    req.on("data", (chunk) => {
      let user = JSON.parse(chunk);
      course[index].content = user.content;
      fs.writeFileSync("course.json", JSON.stringify(course));
      setResponse(200, { message: "Updated" });
    });
  }
  //get all course
  else if (url == "/course" && method == "GET") {
    setResponse(200, course);
  }
  //Get specific course by Id
  else if (url.startsWith("/course/") && method == "GET") {
    let urlId = Number(url.split("/")[2]);
    let index = course.findIndex((course) => course.id == urlId);
    if (index == -1) {
      setResponse(404, { message: "Index Not Found" });
    }
    setResponse(200, course[index]);
  }
  //add course
  else if (url == "/department" && method == "POST") {
    req.on("data", (chunk) => {
      let user = JSON.parse(chunk);
      user.id = department.length + 1;
      user.departmentId = student.length + 1;
      department.push(user);
      fs.writeFileSync("department.json", JSON.stringify(department));
      setResponse(201, { message: "Success" });
    });
  }
  //delete department
  else if (url.startsWith("/department/") && method == "DELETE") {
    let urlId = Number(url.split("/")[2]);
    let index = department.findIndex((department) => department.id == urlId);
    if (index == -1) {
      setResponse(404, { message: "Index Not Found" });
    }
    department.splice(index, 1);
    fs.writeFileSync("department.json", JSON.stringify(department));
    setResponse(200, { message: "Delete" });
  }
  //Update department
  else if (url.startsWith("/department/") && method == "PUT") {
    let urlId = Number(url.split("/")[2]);
    let index = department.findIndex((department) => department.id == urlId);
    if (index == -1) {
      setResponse(404, { message: "Index Not Found" });
    }
    req.on("data", (chunk) => {
      let user = JSON.parse(chunk);
      department[index].name = user.name;
      fs.writeFileSync("department.json", JSON.stringify(department));
      setResponse(200, { message: "Updated" });
    });
  }
  //get all course
  else if (url == "/department" && method == "GET") {
    setResponse(200, department);
  }
  //Get specific department by Id
  else if (url.startsWith("/department/") && method == "GET") {
    let urlId = Number(url.split("/")[2]);
    let index = department.findIndex((department) => department.id == urlId);
    if (index == -1) {
      setResponse(404, { message: "Index Not Found" });
    }
    setResponse(200, department[index]);
  } else {
    setResponse(404, { message: "Not Found" });
  }
});

port.listen(3000, () => {
  console.log("server is running......");
});
