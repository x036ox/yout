import { useRef, useState } from "react"

export const useInput = (initialValue:string) => {
    const [value, setValue] = useState<string>(initialValue);
    const ref = useRef<HTMLInputElement | any>();

    const onChange = (e:any) =>
        setValue(e.target.value);



    //const [inputRef, setInputRef] = useState();

    return {value, onChange, setValue, ref};
}