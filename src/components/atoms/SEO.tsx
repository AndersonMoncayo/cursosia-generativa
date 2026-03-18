import type React from "react";

interface SEOProps {
	title?: string;
	description?: string;
	keywords?: string;
	openGraph?: {
		title: string;
		description: string;
		url?: string;
		image?: string;
	};
}

/**
 * En Next.js App Router (13+) es preferible usar la Metadata API exportando la variable
 * metadata desde la pagina (layout.tsx o page.tsx).
 * Se provee este componente para usos específicos de inserción dinámica,
 * sin usar next/head que está deprecated en App Router.
 */
export const SEO: React.FC<SEOProps> = ({
	title = "CursosIA Generativa",
	description = "Plataforma de IA generativa",
	keywords,
	openGraph,
}) => {
	return (
		<>
			<title>{title}</title>
			<meta name="description" content={description} />
			{keywords && <meta name="keywords" content={keywords} />}

			{openGraph && (
				<>
					<meta property="og:title" content={openGraph.title} />
					<meta property="og:description" content={openGraph.description} />
					{openGraph.url && <meta property="og:url" content={openGraph.url} />}
					{openGraph.image && (
						<meta property="og:image" content={openGraph.image} />
					)}
				</>
			)}
		</>
	);
};
