import axios from 'axios'

export const METADATA_WORKER_URL = 'https://metadata.lenster.xyz'

export const lensUploadToArweave = async (data: any): Promise<string> => {
  try {
    const upload = await axios(METADATA_WORKER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data,
    })

    const { id }: { id: string } = upload?.data

    return `ar://${id}`
  } catch (e: any) {
    console.error(e)

    throw new Error(e)
  }
}
