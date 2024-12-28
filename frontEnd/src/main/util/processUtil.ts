/*
 * @Author: Stevnda 1849698643@qq.com
 * @Date: 2024-12-27 22:10:32
 * @LastEditors: Stevnda 1849698643@qq.com
 * @LastEditTime: 2024-12-28 09:36:01
 * @FilePath: \frontEnd\src\main\util\processUtil.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { taskNode } from '../model/taskNode'
import { modelNode } from '../model/modelNode'
import { spawn } from 'child_process'

class processBuilder {
  _condaStr: string = 'conda activate '

  // public static build = (taskNode: taskNode) => {
  //   const modelNode = taskNode.modelNodeID
  //   return spawn(taskNode.exe_prefix, taskNode.program)
  // }
}
