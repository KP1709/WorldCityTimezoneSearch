import type { ReactNode } from "react";

export default function FlagImage({ image }: { image: string }): ReactNode {
    return (
        <a href="https://flagpedia.net" target="_blank"><img src={image} alt='' /></a>
    )
}