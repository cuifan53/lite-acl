import { readFileSync } from "jsonfile";

export default class LiteAcl {
    private static ac: LiteAcl;
    private rolePermissions: Map<string, Set<string | number>>;

    private constructor() {
        this.rolePermissions = new Map();
    }

    /**
     * 获取ac实例
     */
    static getAC() {
        if (!LiteAcl.ac) {
            LiteAcl.ac = new LiteAcl();
        }
        return LiteAcl.ac;
    }

    /**
     * 添加角色权限
     * @param role 角色
     * @param permissions 权限
     */
    add(role: string, permissions: (string | number)[]) {
        this.rolePermissions.set(role, new Set([...(this.rolePermissions.get(role) || []), ...permissions]));
    }

    /**
     * 从JSON文件添加角色权限
     * @param filepath 文件地址
     */
    addJsonfile(filepath: string) {
        const obj: object = readFileSync(filepath);
        for (const k of Object.keys(obj)) {
            this.rolePermissions.set(k, new Set([...obj[k]]));
        }
    }

    /**
     * 查看指定角色/或全部角色的权限
     * @param role 指定角色 如果不传则为全部角色
     */
    view(role: string | string[] = []): { role: string, permissions: (string | number)[] }[] {
        const roles = Array.isArray(role) ? role : [role];
        const view: { role: string, permissions: (string | number)[] }[] = [];
        if (roles.length > 0) {
            roles.forEach(role => {
                const permissions = this.rolePermissions.get(role);
                if (permissions) {
                    view.push({ role, permissions: [...permissions] });
                }
            })
            return view;
        } else {
            for (const [role, permissions] of this.rolePermissions) {
                view.push({ role, permissions: [...permissions] });
            }
        }
        return view;
    }

    /**
     * 删除指定角色的权限
     * @param role 指定角色
     */
    del(role: string | string[]) {
        const roles = Array.isArray(role) ? role : [role];
        roles.forEach(role => {
            this.rolePermissions.delete(role);
        })
    }

    /**
     * 清空角色权限
     */
    clear() {
        this.rolePermissions.clear();
    }

    /**
     * 验证指定角色是否有指定权限
     * @param askRole 指定角色
     * @param askPermission 指定权限
     * @param options 额外参数 canType: all角色必须包含所有指定的权限才能验证通过,one角色只要包含任一指定的权限即可验证通过
     */
    can(askRole: string | string[], askPermission: string | number | (string | number)[],
        options?: { canType?: 'all' | 'one' }): boolean {
        const askRoles = Array.isArray(askRole) ? askRole : [askRole];
        const askPermissions = Array.isArray(askPermission) ? new Set([...askPermission]) : new Set([askPermission]);
        const canType = options?.canType || 'all';
        let askRolesPermissions: Set<string | number> = new Set();
        for (const askRole of askRoles) {
            const permissions = this.rolePermissions.get(askRole);
            if (!permissions) {
                continue;
            }
            askRolesPermissions = new Set([...askRolesPermissions, ...permissions]);
        }
        const unionSize = (new Set([...askRolesPermissions, ...askPermissions])).size;
        if (canType === 'all') {
            return unionSize === askRolesPermissions.size;
        } else if (canType === 'one') {
            return unionSize < askRolesPermissions.size + askPermissions.size;
        }
        return false;
    }
}