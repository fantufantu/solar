## fantufantu 的服务端架构

使用了太阳系的命名方式。solar system

### 使用了 nestjs 的 monorepo 结构

- sun = gateway
- mercury = 基础服务
- venus = 个人主页的业务服务
- earth = 记账 app 的业务服务

### 服务器重装系统步骤

- 使用 Ubuntu 镜像创建的实例默认禁用 root 用户名通过密码的方式登录实例。如需开启，请参考[Ubuntu 系统如何使用 root 用户登录实例？](https://cloud.tencent.com/document/product/1207/44569#ubuntu-.E7.B3.BB.E7.BB.9F.E5.A6.82.E4.BD.95.E4.BD.BF.E7.94.A8-root-.E7.94.A8.E6.88.B7.E7.99.BB.E5.BD.95.E5.AE.9E.E4.BE.8B.EF.BC.9F)

- 更新 apt

* `apt update`
* `apt upgrade`

- 安装 oh-my-zsh

* `apt install zsh -y`
* `sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"`

- 安装 mysql

* `apt install mysql-server -y`
* 使用 root 用户访问，开启云服务器 3306 防火墙
* 进入 mysql 使用 sql 更新认证方式
* `UPDATE user SET plugin='mysql_native_password' WHERE User='root';`
* `FLUSH PRIVILEGES;`
