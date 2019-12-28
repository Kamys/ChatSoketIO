import { default as React, useCallback, useEffect, useRef, useState } from 'react'

export const createObjectURL = (file?: File | null): string | null => {
  if (file) {
    return URL.createObjectURL(file)
  }

  return null
}

export const useInputFile = (defaultImage: string) => {
  const [file, setFile] = useState<string>(defaultImage)
  const inputFile = useRef<HTMLInputElement>()

  const handleOpenInputFile = useCallback(() => {
    if (inputFile.current) {
      inputFile.current.click()
    }
  }, [])

  const handleAddFile = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newFile = event.target.files[0]

      if (newFile) {
        setFile(createObjectURL(newFile))
      }
    },
    []
  )

  useEffect(() => {
    if (!inputFile.current) {
      return
    }
    inputFile.current.onchange = handleAddFile as any
    inputFile.current.multiple = false
  }, [handleAddFile])

  return { inputFile, handleOpenInputFile, file }
}
