import React, { useState, useRef, ChangeEvent } from 'react';
import './App.css';
import AvatarEditor, { Editor } from './components/avatar-editor/avatar-editor';

export type Img = {
	url: string;
	errorMessage: string | null;
};

function App() {
	const [profileImg, setProfileImg] = useState<Img>({
		url: '',
		errorMessage: null,
	});

	const editorRef = useRef<Editor>(null);

	const { errorMessage, url } = profileImg;

	const onAvatarImgChange = async (e: ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		const file = e.target.files?.[0];
		if (!file) return;

		// validate file

		const validExts = ['jpg', 'png', 'jpeg'];
		const maxFileSize = 5;

		const fileExt = file.name.substring(file.name.lastIndexOf('.') + 1);
		const fileSize = file.size / 1000000; // mb

		if (!validExts.includes(fileExt)) {
			setProfileImg((prevState) => ({
				...prevState,
				errorMessage: `invalid file extension. supported extensions (${validExts.join(
					' '
				)})`,
			}));
			return;
		}

		if (fileSize > maxFileSize) {
			setProfileImg((prevState) => ({
				...prevState,
				errorMessage: `Image is too big (max ${maxFileSize}mb)`,
			}));
			return;
		}

		const dataUrl = await getFileDataUrl(file);

		setProfileImg({
			url: dataUrl,
			errorMessage: null,
		});
	};

	const getFileDataUrl = (file: File) => {
		return new Promise<string>((res) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => res(reader.result as string);
		});
	};

	const onAvatarImgCancel = () => {
		setProfileImg({
			errorMessage: null,
			url: '',
		});
	};

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (editorRef.current) {
			let img: Blob;
			const canvasElement = editorRef.current.getImage();
			canvasElement.toBlob((blob) => {
				img = blob!;
				alert('Check The Console!');
				console.log('Cropped Image: ', img);
			}, 'image/jpeg');
		}
	};

	return (
		<div className='App'>
			<form className='form' onSubmit={onSubmit}>
				<div className='editor'>
					<AvatarEditor
						ref={editorRef}
						inputId='main'
						errorMessage={errorMessage}
						url={url}
						onChange={onAvatarImgChange}
						onCancel={onAvatarImgCancel}
					/>
				</div>
				<div className='button'>
					<button type='submit'>Submit</button>
				</div>
			</form>
		</div>
	);
}

export default App;
