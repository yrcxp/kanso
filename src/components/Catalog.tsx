import * as React from "react";

export default ({
	catalog,
}: {
	catalog: {
		title: string;
		level: number;
	}[];
}) => {
	const [collapse, setCollapse] = React.useState(true);
	const Title = (props, index) => (
		<a
			href={`#${props.title}`}
			key={props.title}
			className="block pt-[5px] pb-[5px] cursor-pointer w-full font-bold hover:bg-[#f6f6f6]"
			style={{ paddingLeft: props.level ? `${12 * props.level}px` : undefined }}
		>
			{props.title}
		</a>
	);
	const handleClick = () => {
		setCollapse(!collapse);
	};
	return (
		<>
			{/* <div className={`max-lg:fixed max-lg:left-0 max-lg:right-0 max-lg:overflow-y-scroll max-lg:transition-all max-lg:duration-300 [&_.card]:rounded-[30px] [&_.card]:max-lg:h-screen ${collapse ? 'max-lg:-top-screen' : 'max-lg:top-14'}`}>
				<Card icon={<ListOutline />} title="目录">
					<div className="px-2.5">{catalog.map(Title)}</div>
				</Card>
			</div>
			<button
				onClick={handleClick}
				className="mt-4 p-0 w-[3.33rem] h-[3.33rem] leading-none text-[#909090] bg-white border border-[#f1f1f1] rounded-full shadow-[0_0_5px_rgba(0,0,0,0.05)] cursor-pointer lg:hidden max-lg:fixed max-lg:bottom-[26px] max-lg:right-[26px]"
			>
				<ListOutline />
			</button> */}
		</>
	);
};
