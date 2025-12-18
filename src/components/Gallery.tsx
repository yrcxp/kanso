import React, { useEffect, useState } from "react";
import Image from "next/image";

const Gallery = ({ photos }) => {
	const [selectedPhotos, setSelectedPhotos] = useState([]);

	useEffect(() => {
		const shuffledPhotos = [...photos].sort(() => Math.random() - 0.5);
		setSelectedPhotos(shuffledPhotos.slice(0, 4));
	}, []);

	return (
		<div className="flex flex-wrap justify-center items-center max-md:flex-col">
			{selectedPhotos.map((photo, index) => {
				const randomAngle = Math.floor(Math.random() * 6) - 3;
				const positions = ["left", "center", "right"];
				const randomPosition =
					positions[Math.floor(Math.random() * positions.length)];

				const alignClass = randomPosition === "left" ? "text-left" :
					randomPosition === "center" ? "text-center" : "text-right";

				return (
					<div
						key={index}
						className="m-5 p-[15px] bg-white rounded-lg shadow-md max-w-[800px] max-md:max-w-[90vw]"
						style={{ transform: `rotate(${randomAngle}deg)` }}
					>
						<div className="relative">
							<Image
								src={photo.imageUrl}
								alt={photo.alt}
								width={800} // Adjust these values as per your layout requirements
								height={450} // Adjust these values as per your layout requirements
								layout="responsive" // Optional, but recommended for responsive images
								className="rounded-none"
							/>
							<p className="absolute bottom-[18px] left-[18px] m-0 p-0.5 font-mono text-base text-orange-500 bg-black/50 rounded-sm">
								{photo.date}
							</p>
						</div>
						<p className={`font-['Patrick_Hand',cursive] mt-2.5 mb-0 text-lg ${alignClass}`}>
							{photo.caption}
						</p>
					</div>
				);
			})}
		</div>
	);
};

export default Gallery;
