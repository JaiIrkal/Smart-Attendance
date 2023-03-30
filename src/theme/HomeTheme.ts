import { background, extendTheme } from "@chakra-ui/react";
import { url } from "inspector";


export const Hometheme = extendTheme({

    styles: {
        global: () => ({
            body: {
                background: '#6e5bc3'
            },

        })
    }
});