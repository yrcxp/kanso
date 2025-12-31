import type { IPost } from "../types";

function sortByDate(flattenPosts: IPost[]): IPost[] {
	// console.log("SortByDate", flattenPosts);
	return flattenPosts
		.filter((post) => "createAt" in post.frontmatter)
		.sort((a, b) => {
			// console.log("sorting", a);
			let dayA = a.frontmatter.createAt.split("/")[2],
				dayB = b.frontmatter.createAt.split("/")[2];
			return dayB - dayA;
		})
		.sort((a, b) => {
			let monthA = a.frontmatter.createAt.split("/")[1],
				monthB = b.frontmatter.createAt.split("/")[1];
			return monthB - monthA;
		})
		.sort((a, b) => {
			let yearA = a.frontmatter.createAt.split("/")[0],
				yearB = b.frontmatter.createAt.split("/")[0];
			return yearB - yearA;
		});
}

export { sortByDate };
