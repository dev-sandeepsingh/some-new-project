// import * as Acl from 'acl';
// import * as AclMemoryRegexpBackend from 'acl-mem-regexp';
// import { UserType } from '../database/entity/User';

// enum RequestType {
//   get = 'get',
//   post = 'post',
//   patch = 'patch',
//   delete = 'delete',
//   put = 'put',
// }

// const acl = new Acl(new AclMemoryRegexpBackend());
// const rolesResources = [
//   {
//     roles: [UserType.admin],
//     allows: [
//       {
//         resources: '/v1/admin.*',
//         permissions: ['post', 'patch', 'get'],
//       },
//     ],
//   },
//   {
//     roles: [UserType.user],
//     allows: [
//       {
//         resources: '/v1/user/[0-9]+',
//         permissions: ['get'],
//       },
//     ],
//   },
// ];
// acl.allow(rolesResources);

// class ForbiddenError extends Error {}

// const checkPermisssion: (
//   role: UserType,
//   resource: string,
//   permission: RequestType,
// ) => Promise<boolean> = async (role, resource, permission) =>
//   new Promise((resolve, reject) => {
//     acl.areAnyRolesAllowed(
//       role,
//       resource,
//       permission,
//       (err, isAllowed: boolean) => {
//         if (err) {
//           const error = new ForbiddenError(err);
//           reject(error);
//           return;
//         }
//         resolve(isAllowed);
//       },
//     );
//   });

// export default checkPermisssion;
