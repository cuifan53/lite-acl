import LiteAcl from '../dist/index';

const ac = LiteAcl.getAC();
ac.addJsonfile('demo.json')
console.log(ac.view('3'))
console.log(ac.can(['role1', '3', 'role2'], ['project.cc.cc', 'project.cc.dd', 'ewe'], { canType: 'all' }))
