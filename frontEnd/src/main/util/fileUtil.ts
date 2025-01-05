import fs from 'fs/promises'
import path from 'path'
import AdmZip from 'adm-zip'
import { createWriteStream } from 'fs'
import { pipeline } from 'stream/promises'
import { createReadStream } from 'fs'

export class fileUtil {
  private static _scriptDir = import.meta.env.MAIN_VITE_SCRIPTS_DIR
  // 解压zip文件
  public static async extractZipFile(model_node_id: string, zipFile: string): Promise<string> {
    const modelDir = path.join(this._scriptDir, model_node_id)
    // 确保目录存在
    await fs.mkdir(modelDir, { recursive: true })

    const tempZipPath = path.join(modelDir, 'temp.zip')

    // 使用 stream 处理 File
    const readStream = createReadStream(zipFile)
    const writeStream = createWriteStream(tempZipPath)
    await pipeline(readStream, writeStream)

    // 解压文件
    const zip = new AdmZip(tempZipPath)
    zip.extractAllTo(modelDir, true)

    // 删除临时zip文件
    await fs.unlink(tempZipPath)

    return modelDir
  }
}
