import BirthdayCard from "./BirthdayCard"
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2'
import { useNavigate } from "react-router";

export default function Main() {
    const [friends, setFriends] = useState('')
    const [name, setName] = useState('');
    const [dob, setDob] = useState('')
    const [message, setMessage] = useState('')
    const [file, setFile] = useState('')
    const [pin, setPin] = useState('')

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault()
        const form = new FormData();
        form.set("name", name);
        form.set("birthday", dob);
        form.set("message", message);
        form.set("image", file);
      
        if (pin === "2002") {
          if (name && dob) {
            axios.post("https://yasirs-birthday-remainder.herokuapp.com/friend/create", form, {
              headers: {
                "Content-Type": "multipart/form-data"
              }
            }).then((res) => {
              console.log(res);
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: `${name} you have been added!`,
                showConfirmButton: false,
                timer: 1800,
                timerProgressBar: true
              }).then((res) => {
                setPin('')
                setName('')
                setDob('')
                setMessage('')
                document.getElementById("friendimg").value = "";
                axios.get("https://yasirs-birthday-remainder.herokuapp.com/friends")
                  .then((resp) => {
                    setFriends(resp.data.friends);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
                navigate('/'); // navigate back to the homepage
              })
            }).catch((error) => {
              console.log(error.message)
            })
          }
          else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Name and birthday are required',
            })
          }
        }
        else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'PIN is not correct',
            footer: '<a href="https://yasir2002.github.io/">Contact developer</a>'
          })
        }
      }
    
      
    useEffect(() => {
        axios.get("https://yasirs-birthday-remainder.herokuapp.com/friends")
            .then((resp) => {
                console.log(resp.data.friends)
                setFriends(resp.data.friends)
                console.log(resp)
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])

    return (
        <>
            <div className="center-container my-5">
                <h1 className="text-center mb-5">Birthdays Remainder</h1>
                <div className="row" >
                    <BirthdayCard friends={friends} />
                </div>
            </div>


            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content" style={{ backgroundColor: "#4E6E81" }}>
                        <div className="modal-header  text-light" >
                            <h5 className="modal-title" id="staticBackdropLabel" style={{ fontWeight: "bolder" }}>Add Your Birthday 🥳</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form action="">
                                <input value={pin} type="number" onChange={(e) => { setPin(e.target.value) }} placeholder="Enter PIN provided by Yasir" className="form-control rounded-pill mb-2" />
                                <input value={name} type="text" onChange={(e) => { setName(e.target.value) }} placeholder="Enter your name here" className="form-control rounded-pill mb-2" />
                                <input value={dob} type="date" onChange={(e) => { setDob(e.target.value) }} placeholder="Enter your birthday" className="form-control rounded-pill mb-2" />
                                <input type="file" onChange={(e) => { setFile(e.target.files[0]) }} accept="image/*" className="form-control rounded-pill mb-2" id="friendimg"/>
                                <input value={message} type="text" onChange={(e) => { setMessage(e.target.value) }} placeholder="Enter a short message for developer (optional)" className="form-control rounded-pill" />
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger rounded-pill px-5 shadow" data-bs-dismiss="modal"><i className="fa fa-xmark"></i></button>
                            <button type="button" className="btn btn-success rounded-pill px-5 shadow" onClick={handleSubmit}><i className="fa fa-check"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}