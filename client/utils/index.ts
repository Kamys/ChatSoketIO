import { default as React, useCallback, useEffect, useRef, useState } from 'react'

export const createObjectURL = (file?: File | null): string | null => {
  if (file) {
    return URL.createObjectURL(file)
  }

  return null
}

export const useInputFile = () => {
  const [file, setFile] = useState<File>()
  const [base64, setBase64] = useState<string>()
  const inputFileRef = useRef<HTMLInputElement>()

  const handleOpenInputFile = useCallback(() => {
    if (inputFileRef.current) {
      inputFileRef.current.click()
    }
  }, [])
  
  useEffect(() => {
    if (!file) {
      return
    }
    const reader = new FileReader()
    reader.onload = () => setBase64(reader.result as string)
    reader.readAsDataURL(file)
  }, [file])

  const handleAddFile = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newFile = event.target.files[0]

      if (newFile) {
        setFile(newFile)
      }
    },
    []
  )

  useEffect(() => {
    if (!inputFileRef.current) {
      return
    }
    inputFileRef.current.onchange = handleAddFile as any
    inputFileRef.current.multiple = false
  }, [handleAddFile])

  return { inputFileRef, handleOpenInputFile, file, base64 }
}
