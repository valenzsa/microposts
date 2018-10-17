import { http } from "./http";
import { ui } from "./ui";

// Get posts on DOM load
document.addEventListener("DOMContentLoaded", getPosts);

// Listen for add post
document.querySelector(".post-submit").addEventListener("click", submitPost);

// Listen for delete
document.querySelector("#posts").addEventListener("click", deletePost);

// Listen for edit state
/**
 * NOTE: Will be using the event delegation by grabbing the parent container to get to the specific target.
 */
document.querySelector("#posts").addEventListener("click", enableEdit);

// Listen for cancel using event delegation
document.querySelector(".card-form").addEventListener("click", cancelEdit);

// Get Posts
function getPosts() {
  http
    .get("http://localhost:3000/posts")
    .then(data => ui.showPosts(data))
    .catch(err => console.log(err));
}

// Submit Post
function submitPost() {
  const title = document.querySelector("#title").value;
  const body = document.querySelector("#body").value;
  const id = document.querySelector("#id").value;

  const data = {
    title: title,
    body: body
  };

  // Validate input
  if (title === "" || body === "") {
    ui.showAlert("Please fill in all fields", "alert alert-danger");
  } else {
    // Check for ID
    if (id === "") {
      // Create post
      http
        .post("http://localhost:3000/posts", data)
        .then(data => {
          ui.showAlert("Post added", "alert alert-success");
          ui.clearFields();
          getPosts();
        })
        .catch(err => console.log(err));
    } else {
      // Update the post
      http
        .put(`http://localhost:3000/posts/${id}`, data)
        .then(data => {
          ui.showAlert("Post updated", "alert alert-success");
          ui.changeFormState("add");
          getPosts();
        })
        .catch(err => console.log(err));
    }
  }
}

// Delete Post
function deletePost(e) {
  e.preventDefault();

  // Using event propagation because there are more than one delete button
  console.log(e.target); // Targets the <i class="fa fa-remove"></i>
  console.log(e.target.parentElement); // Targets the <a href="#" class="delete card-link" data-id="1"></a>
  console.log(e.target.parentElement.dataset); // Prints out the data attributes
  if (e.target.parentElement.classList.contains("delete")) {
    const id = e.target.parentElement.dataset.id;
    if (confirm("Are you sure?")) {
      http
        .delete(`http://localhost:3000/posts/${id}`)
        .then(data => {
          ui.showAlert("Post Removed", "alert alert-success");
          getPosts();
        })
        .catch(err => console.log(err));
    }
  }
}

// Enable Edit State
function enableEdit(e) {
  e.preventDefault();
  /**
   * Since using the event delegation, we need to use the if() statement to check
   */
  if (e.target.parentElement.classList.contains("edit")) {
    const id = e.target.parentElement.dataset.id;

    // Should also be able to get the "TITLE" and "BODY" of the post by using DOM TRAVERSAL
    const title =
      e.target.parentElement.previousElementSibling.previousElementSibling
        .textContent;

    const body = e.target.parentElement.previousElementSibling.textContent;

    const data = {
      id,
      title,
      body
    };

    // Fill form with current post
    ui.fillForm(data);
  }
}

// Cancel Edit State
function cancelEdit(e) {
  e.preventDefault();
  if (e.target.classList.contains("post-cancel")) {
    ui.changeFormState("add");
  }
}
