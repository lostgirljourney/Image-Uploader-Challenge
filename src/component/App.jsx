import "./App.css";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "./../firebase";
import { useState } from "react";
import image from "./../assets/image.svg";

function App() {
	const [progress, setProgress] = useState(-1);
	const [fileValue, setFileValue] = useState("");
	const [link, setLink] = useState(null);

	// * Main function
	const Main = () => {
		return (
			<div className="App">
				<h3>Upload your image</h3>
				<p className="l1">File should be *.jpeg, *.png,...</p>
				<label
					htmlFor="uploadimg"
					className="container"
					onDragOver={handleonDragOverEvents}
					onDragEnter={handleDragEvents}
					onDragLeave={handleDragEvents}
					onDrop={handleDropEvents}
				>
					<img src={image} alt="dragndrop" />
					<p className="l2">Drag & Drop your image here</p>
				</label>
				<p className="l3">or</p>
				<form>
					<input
						type="file"
						className="input"
						id="uploadimg"
						onChange={(e) => upImage(e)}
						value={fileValue}
						accept="image/*"
					/>
					<label htmlFor="uploadimg">Choose a file</label>
				</form>
			</div>
		);
	};

	// * Uploading file function
	function UploadProgress(props) {
		return (
			<div className="progress">
				<p className="upHeading">Uploading...</p>
				<div className="progress-bar">
					<div
						className="progress-bar-fill"
						role="progressbar"
						style={{
							width: `${props.progress}%`,
						}}
						aria-valuemin="0"
						aria-valuemax="100"
					/>
				</div>
			</div>
		);
	}

	// * After file is uploaded function
	function UploadedFile({ downloadURL }) {
		return (
			<>
				<div className="uploaded">
					<span className="material-icons-round check_circle">
						check_circle
					</span>
					<h3>Uploaded Successfully!</h3>

					<img className="preview" src={downloadURL} alt="preview" />

					<p className="link-copy">
						<span id="download-link" onClick={handleCopy}>
							{downloadURL}
						</span>
						<button className="copy-btn" onClick={handleCopy}>
							Copy Link
						</button>
					</p>
				</div>
				<button className="home-btn" onClick={home}>
					<span class="material-icons-round home">home</span>
					&nbsp;Home
				</button>
			</>
		);
	}

	// * file checking and storage calling function
	const upImage = (e) => {
		e.preventDefault();
		const file = e.target.files[0];
		setFileValue("");
		if (!file) return;
		if (!/^image\//.test(file.type)) {
			alert(`File ${file.name} is not an image.`);
			return false;
		}
		uploadImg(file);
	};

	// * Uploading file in firebase function
	const uploadImg = (file) => {
		if (!file) return;
		const storageRef = ref(storage, "images/" + file.name);
		const uploadTask = uploadBytesResumable(storageRef, file);
		uploadTask.on(
			"state_changed",
			(snapshot) => {
				const progress = Math.round(
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100
				);
				setProgress(progress);
			},
			(error) => {
				alert(error);
			},
			() => {
				// Upload completed successfully, now we can get the download URL
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
					setLink(downloadURL);
				});
			}
		);
	};

	// * managing states of dragNdrop file function
	// ! starts
	const handleDragEvents = (e) => {
		e.preventDefault();
		e.stopPropagation();
		document.getElementsByClassName("l2")[0].innerText =
			"Drag & Drop your image here";
		document
			.getElementsByClassName("container")[0]
			.classList.remove("active");
	};

	const handleonDragOverEvents = (e) => {
		e.preventDefault();
		e.stopPropagation();
		document.getElementsByClassName("l2")[0].innerText =
			"Release your image to upload";
		document.getElementsByClassName("container")[0].classList.add("active");
	};

	const handleDropEvents = (e) => {
		e.preventDefault();
		e.stopPropagation();
		document.getElementsByClassName("l2")[0].innerText =
			"Drag & Drop your image here";
		const file = e.dataTransfer.files[0];
		document
			.getElementsByClassName("container")[0]
			.classList.remove("active");
		if (!file) return;
		if (!/^image\//.test(file.type)) {
			alert(`File ${file.name} is not an image.`);
			return false;
		}
		uploadImg(file);
	};
	// ! ends

	// * Copy function
	function handleCopy() {
		let text_to_copy = document.getElementById("download-link").innerText;
		let btn_text = document.getElementsByClassName("copy-btn")[0];
		navigator.clipboard.writeText(text_to_copy);
		btn_text.innerText = "Copied!";
		setTimeout(() => {
			btn_text.innerText = "Copy Link";
		}, 2000);
	}

	// * Home Button CTA function
	function home() {
		setProgress(-1);
		setLink(null);
		return <Main />;
	}

	// * Main function
	if (progress === -1) {
		return <Main />;
	}
	if (progress >= 0 && link === null) {
		return <UploadProgress progress={progress} />;
	}
	if (link !== null) {
		return <UploadedFile downloadURL={link} />;
	}
}

export default App;
