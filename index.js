import express, { urlencoded } from "express";
import bodyParser from "body-parser";
import mongoose, { SchemaTypes } from "mongoose";

const app = express();
mongoose.connect("mongodb://localhost:27017/todoDB");

const todoSchema = new mongoose.Schema({
  name: String,
  deadline: String,
  time: String,
  days: Number,
});

const Todo = mongoose.model("todo", todoSchema);

const todo1 = new Todo({
  name: "Welcome to your ToDo List",
});
const todo2 = new Todo({
  name: "Hit the + button to add new item",
});
const todo3 = new Todo({
  name: "<---- Hit this to delete an item",
});
const defaultItems = [todo1, todo2, todo3];

const listSchema = new mongoose.Schema({
  name: String,
  listItems: [todoSchema],
});

const List = mongoose.model("List", listSchema);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  const date = new Date();
  var num = date.getDay();
  var day;
  if (num === 0) {
    day = "Sunday";
  } else if (num === 1) {
    day = "Monday";
  } else if (num === 2) {
    day = "Tuesday";
  } else if (num === 3) {
    day = "Wednesday";
  } else if (num === 4) {
    day = "Thursday";
  } else if (num === 5) {
    day = "Friday";
  } else if (num === 6) {
    day = "Saturday";
  }
  Todo.find()
    .sort({ days: 1 })
    .then((result) => {
      if (result.length === 0) {
        Todo.insertMany(defaultItems)
          .then(() => {
            console.log("Data saved!!");
          })
          .catch((err) => {
            console.log(err);
          });
        res.redirect("/");
      } else {
        res.render("index.ejs", {
          array: result,
          date:
            day +
            "   " +
            date.getDate() +
            " - " +
            (date.getMonth() + 1) +
            " - " +
            date.getFullYear(),
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/", (req, res) => {
  //   arr.push(req.body["task"]);
  //   res.redirect("/");
  const newTask = req.body.task;
  const newDeadLine = req.body.deadline;
  const newTime = req.body.time;
  const today = new Date(); // Current date and time
  const otherDate = new Date(newDeadLine); // Another date
  const timeDifferenceMs = otherDate - today;
  const daysDifference = Math.floor(timeDifferenceMs / (1000 * 60 * 60 * 24));
  console.log(daysDifference);
  const newTodo = new Todo({
    name: newTask,
    deadline: newDeadLine,
    time: newTime,
    days: daysDifference,
  });
  newTodo.save();
  res.redirect("/");
});

app.post("/delete", function (req, res) {
  const checktId = req.body.chkBox;
  Todo.findByIdAndDelete(checktId)
    .then(() => {
      console.log(`Item with id ${checktId} is removed.`);
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});

// app.get("/work", (req, res) => {
//   res.render("work.ejs", { array: arr2 });
// });

app.get("/:customeListName", (req, res) => {
  const customListName = req.params.customeListName;
  // console.log(customListName);

  List.findOne({ name: customListName }).then((foundList) => {
    if (!foundList) {
      //Create a new list
      const list = new List({
        name: customListName,
        items: defaultItems,
      });
      list.save();
      res.redirect("/" + customListName);
    } else {
      //Show an existing list
      console.log(foundList);
      res.render("list.ejs", {
        listTitle: foundList.name,
        newListItems: foundList.items,
      });
    }
  }).catch((err)=>{
    console.log(err);
  });
});

app.post("/:customeListName",(req,res)=>{
  const newTask = req.body.task;
  const newDeadLine = req.body.deadline;
  const newTime = req.body.time;
  const today = new Date(); // Current date and time
  const otherDate = new Date(newDeadLine); // Another date
  const timeDifferenceMs = otherDate - today;
  const daysDifference = Math.floor(timeDifferenceMs / (1000 * 60 * 60 * 24));
  
})

app.listen(3000, () => {
  console.log("Project running on port 3000");
});
