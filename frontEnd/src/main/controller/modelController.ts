import 'reflect-metadata'
import express from 'express'
import { Request, Response } from 'express'
import { modelService } from '../service/modelService'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { modelNode } from '../model/modelNode'

export const modelController = express.Router()
const model_service = new modelService(modelNode)
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (_req, file, cb) {
    // 保留原始文件扩展名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})
const upload = multer({ storage: storage })

// api/model/register
modelController.post('/register', upload.single('file'), async (req: Request, res: Response) => {
  const fileDir = req.file?.path
  const data = JSON.parse(req.body.data)
  const parentId = req.body?.parentId
  const result = await model_service.register(data, parentId, fileDir)
  // 删除上传的文件
  if (fileDir) {
    fs.unlink(fileDir, (err) => {
      if (err) {
        console.error('Error deleting uploaded file:', err)
      }
    })
  }
  res.status(result.code).json(result)
})

// api/model/list
modelController.get('/list', async (_req: Request, res: Response) => {
  const result = await model_service.getNodeList()
  res.status(result.code).json(result)
})

// api/model/:id
modelController.delete('/:id', async (req: Request, res: Response) => {
  const result = await model_service.delete(req.params.id)
  res.status(result.code).json(result)
})

// api/model/:id
modelController.put('/:id', async (req: Request, res: Response) => {
  const result = await model_service.updateNode(req.params.id, req.body)
  res.status(result.code).json(result)
})

// api/model/test/:id
modelController.get('/test/:id', async (req: Request, res: Response) => {
  const result = await model_service.test(req.params.id)
  res.status(result.code).json(result)
})

// api/model/descendants/:id
modelController.get('/descendants/:id', async (req: Request, res: Response) => {
  const result = await model_service.getDescendantsTree(req.params.id)
  res.status(result.code).json(result)
})
