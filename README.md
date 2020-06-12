# lite-acl

NPI需要对接口做权限控制，所以自己写了个超轻量级的 ACL

```
import LiteAcl,{Can} from 'lite-acl';

const ac = LiteAcl.getAC();

ac.add('role1', ['a', 1, 'b']);
ac.add('role2', 'dd.ee');
ac.add({'role3':[1,2,3], 'role4':[4,5]})

ac.view('role1');
ac.view(); // 查看所有角色权限

ac.can('role1', 'a'); // true
ac.can('role1', ['a',1]); // true
ac.can('role1', ['a', 'c']); // false
ac.can('role1', ['a', 'c'], {canType:'one'}); // true
ac.can(['role1', 'role2'], ['a','dd.ee']); // true

class AController{
  @Can(['dd.ee'],'role2')
  run1(){
  }

  @Can(['dd.ee']) // 如果省略角色，则角色默认取ctx.liteAclRole属性值
  run2(){
  }
}
```

NPI用法如下，以获取文件历史版本接口为例：
1.@Before([projectRole]) 判断用户在项目中的角色
2.@Can([NPIPermission.ProjectFileVersions.Read]) 校验用户所属角色是否有项目文件版本的读权限
```
import { Can } from 'lite-acl';
import { NPIPermission } from '../util/npiAcl';

@Get('/v1/projects/file/groups/:groupId/versions')
@Description('获取文件历史版本')
@Parameters([
    { name: 'x-auth-token', in: 'header', description: 'token', required: true, type: 'string' },
])
@Responses({ 200: { description: '成功', schema: { type: 'object', $ref: '#/definitions/Response' } } })
@Before([projectRole])
@Can([NPIPermission.ProjectFileVersions.Read])
public async getFileHistory({ params: { groupId } }) {
    const files = await this.ctx.service.file.getFileHistory(Types.ObjectId(groupId));
    return this.success(files);
}

@Post('/v1/projects/:projectId/tasks/:taskId/files/:id')
@Description('上传任务文件')
@Parameters([
    { name: 'x-auth-token', in: 'header', description: 'token', required: true, type: 'string' },
])
@Responses({ 200: { description: '成功', schema: { type: 'object', $ref: '#/definitions/Response' } } })
@Before([projectRole, taskRole])
@Can([NPIPermission.TaskFile.Create])
public async uploadFile({ params: { projectId, taskId, id } }) {
    const data = await this.ctx.service.file.uploadFile(Types.ObjectId(id), Types.ObjectId(projectId), Types.ObjectId(taskId), this.ctx.body);
    return this.success(data);
}
```
