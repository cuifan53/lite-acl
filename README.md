# lite-acl
最近做公司项目需要对接口做权限控制，但是npm的组件都太大了，所以自己写了个超轻量级的ACL

```
import LiteAcl,{Can} from 'lite-acl';

const ac = LiteAcl.getAC();

ac.add('role1', ['a', 1, 'b']);
ac.add('role2', 'dd.ee');
ac.add('demo.json'); // 可以从json文件读取配置，但是必须是 {(role:string):(permissions:(string|number)[])}格式的json

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
