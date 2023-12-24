import { onGetDatas, saveData, deleteData, updateData } from "./firebase.js";

const addForm = document.getElementById("addForm");
const editForm = document.getElementById("editForm");
const listContainer = document.getElementById("listContainer");
const closeModal = document.getElementById("closeModal");

const form = `
<div class="mb-4">
  <label for="name" class="block text-gray-600 text-sm font-medium mb-2">Title</label>
  <input type="text" id="title" name="title"
    class="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500">
</div>

<div class="mb-4">
  <label for="description" class="block text-gray-600 text-sm font-medium mb-2">Description</label>
  <textarea id="description" name="description" rows="3"
    class="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"></textarea>
</div>

<div class="mb-4">
  <label for="priority" class="block text-gray-600 text-sm font-medium mb-2">Priority</label>
  <select id="priority" name="priority"
    class="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500">
    <option value="low">Low</option>
    <option value="medium">Medium</option>
    <option value="high">High</option>
  </select>
</div>
`;

window.addEventListener("DOMContentLoaded", async () => {
  document.querySelector(".addForm").innerHTML = form;
  document.querySelector(".editForm").innerHTML = form;
  populateData();
});

addForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = addForm.querySelector("#title").value;
  const description = addForm.querySelector("#description").value;
  const priority = addForm.querySelector("#priority").value;

  try {
    await saveData({ title, description, priority });
    addForm.reset();
  } catch (error) {
    console.log(error);
  }
});

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = editForm.querySelector("#id").value;

  const title = editForm.querySelector("#title").value;
  const description = editForm.querySelector("#description").value;
  const priority = editForm.querySelector("#priority").value;

  try {
    await updateData(id, { title, description, priority });
    editForm.reset();
    closeEditModal();
  } catch (error) {
    console.log(error);
  }
});

closeModal.addEventListener("click", () => {
  closeEditModal();
});

function openEditModal(data) {
  editForm.querySelector("#id").value = data.id;
  editForm.querySelector("#title").value = data.title;
  editForm.querySelector("#description").value = data.description;
  editForm.querySelector("#priority").value = data.priority;
  document.getElementById("editModal").classList.remove("hidden");
}

function closeEditModal() {
  document.getElementById("editModal").classList.add("hidden");
}

function populateData() {
  onGetDatas((querySnapshot) => {
    const dataList = [];
    listContainer.innerHTML = "";
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      dataList.push({ ...data, id: doc.id });
      listContainer.innerHTML += `
        <div class="mb-4 border-b pb-4">
          <h3 class="text-lg font-medium mb-2">${data.title}</h3>
          <p class="text-gray-600 mb-2">${data.description}</p>
          <p class="text-gray-600 mb-2">Priority: ${data.priority}</p>

          <div class="mt-2 flex space-x-2">
            <button
              class="text-blue-500 hover:underline editBtn"
            >
              Edit
            </button>
            <button class="text-red-500 hover:underline deleteBtn">Delete</button>
          </div>
        </div>
      `;
    });

    const btnsEdit = document.querySelectorAll(".editBtn");
    const btnsDelete = document.querySelectorAll(".deleteBtn");

    btnsEdit.forEach((btn, i) => {
      btn.addEventListener("click", async () => {
        openEditModal(dataList[i]);
      });
    });

    btnsDelete.forEach((btn, i) => {
      btn.addEventListener("click", async () => {
        if (confirm("Are you sure to delete?")) {
          try {
            await deleteData(dataList[i].id);
          } catch (error) {
            console.log(error);
          }
        }
      });
    });
  });
}
