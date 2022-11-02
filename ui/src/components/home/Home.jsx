import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../config";
import Modal from "react-modal";
import "./Home.css";
// import { UserContext } from "../../Context";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("#root");

function Home({ client, setclient }) {
  const [txt, settxt] = useState("");
  const [todos, settodos] = useState({});
  useEffect(() => {
    axiosInstance.get(`todos/${client._id}`).then((res) => {
      settodos(res.data);
    });
  });
  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    subtitle.style.color = "#f00";
  }

  function closeModal() {
    setIsOpen(false);
    settxt("");
  }
  return (
    <div className="wrapper">
      <div className="search-input">
        <div className="add-task">
          <input
            type="text"
            className="text-input"
            value={txt}
            onChange={(e) => settxt(e.target.value)}
            placeholder="Add a new task..."
          />
          <button
            className="icon"
            onClick={() => {
              console.log(client._id, client.username);
              axiosInstance
                .post("todo", {
                  userId: client._id,
                  desc: txt,
                })
                .then((res) => {
                  axiosInstance.get(`todos/${client._id}`).then((res) => {
                    settodos(res.data);
                  });
                  settxt("");
                });
            }}
          >
            <div className="send">
              {" "}
              <i
                class="fas fa-plus-square"
                // style={{ fontSize: "22px", color: "red" }}
              ></i>
            </div>
          </button>
        </div>

        <ul className="delete-box">
          {Object.keys(todos)?.map((x, ind) => {
            return (
              <li className="todo-list" key={ind}>
                <p className="desc">
                  {ind + 1 + "."}
                  {/* {todos[x].desc} */}
                  {todos[x].desc}
                </p>
                <div className="icon-container">
                  <button
                    className="delete-btn"
                    onClick={() => {
                      axiosInstance
                        .delete(`todos/${todos[x]._id}`)
                        .then((res) => {
                          axiosInstance
                            .get(`todos/${client._id}`)
                            .then((res) => {
                              settodos(res.data);
                            });
                        });
                    }}
                  >
                    <i
                      className="remove"
                      class="fas fa-check"
                      style={{ fontSize: "20px", color: "red" }}
                    ></i>
                  </button>

                  <button className="edit" onClick={openModal}>
                    <i
                      class="fas fa-pencil-alt"
                      style={{ fontSize: "20px", color: "red" }}
                    ></i>
                  </button>
                </div>
                <Modal
                  className="poppups"
                  isOpen={modalIsOpen}
                  onAfterOpen={afterOpenModal}
                  onRequestClose={closeModal}
                  style={customStyles}
                  contentLabel="Example Modal"
                >
                  <div className="head-edit">
                    <div ref={(_subtitle) => (subtitle = _subtitle)}>
                      <div className="spancontainer">
                        <span>Edit</span>
                      </div>
                      <br />
                      <p className=" editor">{todos[x].desc}</p>
                    </div>
                  </div>

                  <input
                    type="text"
                    className="edit-text"
                    placeholder="Change your task ..."
                    value={txt}
                    onChange={(e) => settxt(e.target.value)}
                  />
                  <button
                    className="cancel-btn"
                    onClick={() => {
                      axiosInstance
                        .put(`todos/${todos[x]._id}`, {
                          desc: txt,
                        })
                        .then((res) => {
                          settxt("");
                          axiosInstance
                            .get(`todos/${client._id}`)
                            .then((res) => {
                              settodos(res.data);
                            });
                        });
                      closeModal();
                    }}
                    disabled={!txt}
                  >
                    Okay
                  </button>
                  <button className="cancel-btn" onClick={closeModal}>
                    Cancel
                  </button>
                </Modal>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default Home;
