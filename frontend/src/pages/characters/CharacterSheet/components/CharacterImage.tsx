import type { BackgroundImageProps } from "../../../../types/backgroundImageProps";

const CharacterImage: React.FC<{ image: BackgroundImageProps }> = ({
	image,
}) => {
	return (
		<div className="col-span-2 w-full aspect-[3/4] place-self-end">
			<div
                className="bg-center bg-cover w-full aspect-[3/4] border-4 border-black rounded-xl cursor-pointer"
				style={{
					backgroundImage: image.backgroundImage,
					backgroundPosition: image.backgroundPosition,
					backgroundSize: image.backgroundSize,
				}}
			/>
		</div>
	);
};

export default CharacterImage;