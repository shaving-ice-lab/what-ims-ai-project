import { Text, View } from '@tarojs/components';
import { useSelector } from 'react-redux';
import { ROLE_ICONS, ROLE_NAMES, useRole } from '../../hooks/useRole';
import type { UserRole } from '../../store/slices/authSlice';
import { selectUserRoles } from '../../store/slices/authSlice';
import './index.scss';

// 角色描述
const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  admin: '管理系统设置、查看数据报表、管理用户权限',
  sub_admin: '协助管理日常运营、处理订单审核',
  supplier: '管理物料价格、处理订单配送',
  store: '浏览商品、下单订货、查看订单状态',
};

export default function SelectRolePage() {
  const userRoles = useSelector(selectUserRoles);
  const { switchRole, handleLogout } = useRole();

  const handleSelectRole = (role: UserRole) => {
    switchRole(role);
  };

  return (
    <View className="select-role-page">
      <View className="header">
        <Text className="title">选择身份</Text>
        <Text className="subtitle">您拥有多个角色，请选择要使用的身份</Text>
      </View>

      <View className="role-list">
        {userRoles.map((role) => (
          <View key={role} className="role-card" onClick={() => handleSelectRole(role)}>
            <View className="role-icon">
              <Text className="icon-text">{ROLE_ICONS[role]}</Text>
            </View>
            <View className="role-info">
              <Text className="role-name">{ROLE_NAMES[role]}</Text>
              <Text className="role-desc">{ROLE_DESCRIPTIONS[role]}</Text>
            </View>
            <View className="arrow">
              <Text className="arrow-icon">→</Text>
            </View>
          </View>
        ))}
      </View>

      <View className="footer">
        <Text className="logout-btn" onClick={handleLogout}>
          退出登录
        </Text>
      </View>
    </View>
  );
}
