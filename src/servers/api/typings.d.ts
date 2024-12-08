declare namespace API {
  type AIChatMessage = {
    /** 消息内容 */
    content?: string;
    /** 创建时间 */
    created_time?: string;
    /** 消息ID */
    id?: number;
    /** 逻辑删除标记 */
    isDelete?: number;
    /** 模型名称 */
    model?: string;
    /** 角色（user/assistant/system） */
    role?: string;
    /** 会话ID */
    session_id?: number;
    /** 消息tokens（用于统计和上下文控制） */
    tokens?: number;
  };

  type AIChatRequest = {
    do_sample?: boolean;
    frequency_penalty?: number;
    maxTokens?: number;
    messages?: MessageReq[];
    model?: string;
    n?: number;
    presence_penalty?: number;
    request_id?: number;
    stream?: boolean;
    temperature?: number;
    top_p?: number;
  };

  type AIChatResponse = {
    /** 聊天完成的选项列表 */
    choices?: Choice[];
    /** 创建时间的时间戳 */
    created?: number;
    /** 聊天完成的唯一标识符 */
    id?: string;
    /** 使用的模型ID */
    model?: string;
    /** 对象类型，通常为 'chat.completion' */
    object?: string;
    /** 系统指纹 */
    system_fingerprint?: string;
    /** 令牌使用情况 */
    usage?: Usage;
  };

  type AIChatSessionVO = {
    /** 创建时间 */
    created_time?: string;
    /** 会话ID */
    id?: number;
    /** 逻辑删除标记 */
    isDelete?: number;
    /** AI模型 */
    model?: string;
    /** 会话名称 */
    session_name?: string;
    /** 会话状态（active/inactive） */
    status?: string;
    /** 会话摘要 */
    summary?: string;
    /** 更新时间 */
    updated_time?: string;
    /** 用户VO */
    userVO?: UserVO;
    /** 用户ID */
    user_id?: number;
  };

  type AIModel = {
    /** API密钥 */
    api_key?: string;
    context_window?: string;
    /** 创建时间 */
    created_time?: string;
    /** ID */
    id?: number;
    /** 逻辑删除标记 */
    is_deleted?: number;
    max_output_tokens?: string;
    model_desc?: string;
    /** 模型名称 */
    model_name?: string;
    /** 模型类型 */
    model_type?: string;
    /** AI 平台 */
    platform_id?: number;
    /** 费率 */
    rate?: number;
    /** 更新时间 */
    updated_time?: string;
  };

  type AIPlatform = {
    /** API基础URL */
    api_url?: string;
    /** 创建时间 */
    created_time?: string;
    /** ID */
    id?: number;
    /** 逻辑删除标记 */
    is_deleted?: number;
    /** 平台描述 */
    platform_description?: string;
    /** 平台封面 */
    platform_image_url?: string;
    /** 平台名称 */
    platform_name?: string;
    /** 平台链接 */
    platform_url?: string;
    /** 更新时间 */
    updated_time?: string;
  };

  type BaseResponseAIChatResponse = {
    code?: number;
    data?: AIChatResponse;
    message?: string;
  };

  type BaseResponseAIPlatform = {
    code?: number;
    data?: AIPlatform;
    message?: string;
  };

  type BaseResponseboolean = {
    code?: number;
    data?: boolean;
    message?: string;
  };

  type BaseResponseHomeVO = {
    code?: number;
    data?: HomeVO;
    message?: string;
  };

  type BaseResponseint = {
    code?: number;
    data?: number;
    message?: string;
  };

  type BaseResponseListAIChatMessage = {
    code?: number;
    data?: AIChatMessage[];
    message?: string;
  };

  type BaseResponseListAIChatSessionVO = {
    code?: number;
    data?: AIChatSessionVO[];
    message?: string;
  };

  type BaseResponseListAIModel = {
    code?: number;
    data?: AIModel[];
    message?: string;
  };

  type BaseResponseListAIPlatform = {
    code?: number;
    data?: AIPlatform[];
    message?: string;
  };

  type BaseResponseListCommentVO = {
    code?: number;
    data?: CommentVO[];
    message?: string;
  };

  type BaseResponseListNotice = {
    code?: number;
    data?: Notice[];
    message?: string;
  };

  type BaseResponseListOrderVO = {
    code?: number;
    data?: OrderVO[];
    message?: string;
  };

  type BaseResponseListPostVO = {
    code?: number;
    data?: PostVO[];
    message?: string;
  };

  type BaseResponseListProductVO = {
    code?: number;
    data?: ProductVO[];
    message?: string;
  };

  type BaseResponseListScoreVO = {
    code?: number;
    data?: ScoreVO[];
    message?: string;
  };

  type BaseResponseListstring = {
    code?: number;
    data?: string[];
    message?: string;
  };

  type BaseResponseListTaskVO = {
    code?: number;
    data?: TaskVO[];
    message?: string;
  };

  type BaseResponseListUser = {
    code?: number;
    data?: User[];
    message?: string;
  };

  type BaseResponselong = {
    code?: number;
    data?: number;
    message?: string;
  };

  type BaseResponseNotice = {
    code?: number;
    data?: Notice;
    message?: string;
  };

  type BaseResponseobject = {
    code?: number;
    data?: Record<string, any>;
    message?: string;
  };

  type BaseResponseOrderVO = {
    code?: number;
    data?: OrderVO;
    message?: string;
  };

  type BaseResponsePostVO = {
    code?: number;
    data?: PostVO;
    message?: string;
  };

  type BaseResponseProductVO = {
    code?: number;
    data?: ProductVO;
    message?: string;
  };

  type BaseResponsestring = {
    code?: number;
    data?: string;
    message?: string;
  };

  type BaseResponseTaskDataVO = {
    code?: number;
    data?: TaskDataVO;
    message?: string;
  };

  type BaseResponseUser = {
    code?: number;
    data?: User;
    message?: string;
  };

  type BaseResponseUserVO = {
    code?: number;
    data?: UserVO;
    message?: string;
  };

  type BaseResponseWebsiteVO = {
    code?: number;
    data?: WebsiteVO;
    message?: string;
  };

  type changeShelvesUsingGETParams = {
    /** id */
    id: number;
  };

  type checkEmailUsingGETParams = {
    /** email */
    email: string;
  };

  type checkPhoneUsingGETParams = {
    /** phone */
    phone: string;
  };

  type Choice = {
    /** 完成的原因 */
    finish_reason?: string;
    /** 选项的索引 */
    index?: number;
    /** 日志概率信息 */
    logprobs?: string;
    /** 消息对象 */
    message?: MessageRes;
  };

  type clearMessagesUsingDELETEParams = {
    /** sessionId */
    sessionId: number;
  };

  type CommentAddRequest = {
    content?: string;
    parent_id?: number;
    post_id?: number;
    root_parent_id?: number;
    user_id?: number;
    user_name?: string;
  };

  type CommentDeleteRequest = {
    id?: number;
  };

  type CommentVO = {
    child?: CommentVO[];
    content?: string;
    createTime?: string;
    id?: number;
    parent_id?: number;
    post_id?: number;
    post_name?: string;
    root_parent_id?: number;
    updateTime?: string;
    user?: UserVO;
    user_id?: number;
  };

  type CreateModelRequest = {
    api_key?: string;
    context_window?: string;
    max_output_tokens?: string;
    model_desc?: string;
    model_name?: string;
    model_type?: string;
    platform_id?: number;
    rate?: number;
  };

  type CreateNoticeDto = {
    content?: string;
    create_user?: string;
    end_time?: string;
    sort?: number;
    start_time?: string;
    status?: number;
    title?: string;
  };

  type CreateSessionRequest = {
    model?: string;
    userId?: number;
  };

  type CreateUserDto = {
    /** 家庭住址 */
    address?: string;
    /** 头像 */
    avatar?: string;
    /** 个人简介 */
    description?: string;
    /** 邮箱 */
    email?: string;
    /** 手机号码 */
    mobile?: string;
    /** 昵称 */
    name?: string;
    /** 密码(加密) */
    password?: string;
    /** 角色 */
    role?: string;
    /** 性别 */
    sex?: string;
    /** 账号状态 #1：正常, 2：禁用 */
    status?: number;
    /** 账号 */
    username?: string;
  };

  type createVipOrderUsingPOSTParams = {
    /** days */
    days: number;
  };

  type deleteModelUsingDELETEParams = {
    /** id */
    id: number;
  };

  type DeleteNoticeDto = {
    /** 通知id */
    notice_id?: number;
  };

  type deletePlatformUsingDELETEParams = {
    /** id */
    id: number;
  };

  type DeleteRequest = {
    id?: number;
  };

  type deleteSessionUsingDELETEParams = {
    /** id */
    id: string;
  };

  type deleteUserUsingDELETEParams = {
    /** user_id */
    user_id: number;
  };

  type favourPostUsingPOSTParams = {
    /** postId */
    postId: number;
  };

  type Feature = {
    content?: string;
    icon?: string;
    title?: string;
  };

  type generateSummaryUsingPOSTParams = {
    /** postId */
    postId: number;
  };

  type getCommentBySearchTextUsingGETParams = {
    /** searchText */
    searchText: string;
  };

  type getCommentsByPostIdUsingGETParams = {
    /** postId */
    postId: number;
  };

  type GetMessageRequest = {
    limit?: number;
    sessionId?: number;
  };

  type getOrderVOByIdUsingGETParams = {
    /** id */
    id: number;
  };

  type getPlatformByIdUsingGETParams = {
    /** id */
    id: number;
  };

  type getPlatformIdByModelNameUsingGETParams = {
    /** modelName */
    modelName: string;
  };

  type getPostVOByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getProductByIdUsingGETParams = {
    /** id */
    id: number;
  };

  type getProductsByTagsUsingGETParams = {
    /** tags */
    tags?: string;
  };

  type getUserByUserIdUsingGETParams = {
    /** user_id */
    user_id?: number;
  };

  type getUsersByCategoryUsingGETParams = {
    /** category */
    category?: string;
    /** ascending */
    ascending?: boolean;
  };

  type getUsersBySearchTextUsingGETParams = {
    /** searchText */
    searchText?: string;
  };

  type HomeVO = {
    aitop10?: AIPlatform[];
    commentCount?: number;
    commentList?: CommentVO[];
    notice?: Notice;
    orderCount?: number;
    orderList?: OrderVO[];
    orderTotalPrice?: number;
    postCount?: number;
    postList?: PostVO[];
    productCount?: number;
    productList?: ProductVO[];
    userCount?: number;
    visitCount?: number;
  };

  type incrementViewUsingPOSTParams = {
    /** postId */
    postId: number;
  };

  type listModelsByPlatformIdUsingGETParams = {
    /** platformId */
    platformId: number;
  };

  type listPagedPostsUsingGETParams = {
    /** page */
    page?: number;
    /** size */
    size?: number;
  };

  type listPostsByTagUsingGETParams = {
    /** tag */
    tag?: string;
  };

  type loginByEmailUsingPOSTParams = {
    /** email */
    email: string;
    /** code */
    code: string;
  };

  type LoginRequest = {
    geetestChallenge?: string;
    geetestSeccode?: string;
    geetestValidate?: string;
    password?: string;
    username?: string;
  };

  type MessageReq = {
    content?: string;
    name?: string;
    role?: string;
  };

  type MessageRes = {
    /** 消息的内容 */
    content?: string;
    /** 消息作者的角色 */
    role?: string;
  };

  type ModelAndView = {
    empty?: boolean;
    model?: Record<string, any>;
    modelMap?: Record<string, any>;
    reference?: boolean;
    status?:
      | "ACCEPTED"
      | "ALREADY_REPORTED"
      | "BAD_GATEWAY"
      | "BAD_REQUEST"
      | "BANDWIDTH_LIMIT_EXCEEDED"
      | "CHECKPOINT"
      | "CONFLICT"
      | "CONTINUE"
      | "CREATED"
      | "DESTINATION_LOCKED"
      | "EXPECTATION_FAILED"
      | "FAILED_DEPENDENCY"
      | "FORBIDDEN"
      | "FOUND"
      | "GATEWAY_TIMEOUT"
      | "GONE"
      | "HTTP_VERSION_NOT_SUPPORTED"
      | "IM_USED"
      | "INSUFFICIENT_SPACE_ON_RESOURCE"
      | "INSUFFICIENT_STORAGE"
      | "INTERNAL_SERVER_ERROR"
      | "I_AM_A_TEAPOT"
      | "LENGTH_REQUIRED"
      | "LOCKED"
      | "LOOP_DETECTED"
      | "METHOD_FAILURE"
      | "METHOD_NOT_ALLOWED"
      | "MOVED_PERMANENTLY"
      | "MOVED_TEMPORARILY"
      | "MULTIPLE_CHOICES"
      | "MULTI_STATUS"
      | "NETWORK_AUTHENTICATION_REQUIRED"
      | "NON_AUTHORITATIVE_INFORMATION"
      | "NOT_ACCEPTABLE"
      | "NOT_EXTENDED"
      | "NOT_FOUND"
      | "NOT_IMPLEMENTED"
      | "NOT_MODIFIED"
      | "NO_CONTENT"
      | "OK"
      | "PARTIAL_CONTENT"
      | "PAYLOAD_TOO_LARGE"
      | "PAYMENT_REQUIRED"
      | "PERMANENT_REDIRECT"
      | "PRECONDITION_FAILED"
      | "PRECONDITION_REQUIRED"
      | "PROCESSING"
      | "PROXY_AUTHENTICATION_REQUIRED"
      | "REQUESTED_RANGE_NOT_SATISFIABLE"
      | "REQUEST_ENTITY_TOO_LARGE"
      | "REQUEST_HEADER_FIELDS_TOO_LARGE"
      | "REQUEST_TIMEOUT"
      | "REQUEST_URI_TOO_LONG"
      | "RESET_CONTENT"
      | "SEE_OTHER"
      | "SERVICE_UNAVAILABLE"
      | "SWITCHING_PROTOCOLS"
      | "TEMPORARY_REDIRECT"
      | "TOO_EARLY"
      | "TOO_MANY_REQUESTS"
      | "UNAUTHORIZED"
      | "UNAVAILABLE_FOR_LEGAL_REASONS"
      | "UNPROCESSABLE_ENTITY"
      | "UNSUPPORTED_MEDIA_TYPE"
      | "UPGRADE_REQUIRED"
      | "URI_TOO_LONG"
      | "USE_PROXY"
      | "VARIANT_ALSO_NEGOTIATES";
    view?: View;
    viewName?: string;
  };

  type Notice = {
    content?: string;
    /** 创建时间 */
    createTime?: string;
    create_user?: string;
    end_time?: string;
    isDelete?: number;
    /** 通知id */
    notice_id?: number;
    sort?: number;
    start_time?: string;
    status?: number;
    title?: string;
    /** 更新时间 */
    updateTime?: string;
    update_user?: string;
  };

  type openVipUsingPOSTParams = {
    /** userId */
    userId: number;
    /** months */
    months: number;
  };

  type OrderCreateRequest = {
    count?: number;
    payMethod?: string;
    productId?: number;
    type?: string;
  };

  type OrderUpdateRequest = {
    id?: number;
    status?: string;
  };

  type OrderVO = {
    createTime?: string;
    id?: number;
    isDelete?: number;
    money?: number;
    payTime?: string;
    paymentMethod?: string;
    product?: ProductVO;
    productId?: number;
    status?: number;
    updateTime?: string;
    user?: UserVO;
    userId?: number;
  };

  type payUsingGETParams = {
    /** orderId */
    orderId: number;
  };

  type PostAddRequest = {
    content?: string;
    cover?: string;
    tagList?: string[];
    title?: string;
  };

  type PostDeleteRequest = {
    post_id?: number;
  };

  type PostGenerateRequest = {
    model?: string;
    prompt?: string;
  };

  type PostQueryRequest = {
    current?: number;
    pageSize?: number;
    searchText?: string;
    sortField?: string;
    sortOrder?: string;
  };

  type PostUpdateRequest = {
    content?: string;
    cover?: string;
    id?: number;
    tagList?: string[];
    title?: string;
  };

  type PostVO = {
    content?: string;
    cover?: string;
    createTime?: string;
    favourNum?: number;
    id?: number;
    isFavoured?: boolean;
    isThumbed?: boolean;
    tagList?: string[];
    thumbNum?: number;
    title?: string;
    updateTime?: string;
    user?: UserVO;
    userId?: number;
    viewsNum?: number;
  };

  type ProductAddRequest = {
    content?: string;
    description?: string;
    images?: string;
    price?: number;
    stock?: number;
    tags?: string;
    title?: string;
    userId?: number;
  };

  type ProductUpdateRequest = {
    buyNum?: number;
    content?: string;
    description?: string;
    id?: number;
    images?: string;
    isShelves?: number;
    price?: number;
    stock?: number;
    tags?: string;
    title?: string;
    userId?: number;
    viewsNum?: number;
  };

  type ProductVO = {
    buyNum?: number;
    content?: string;
    createTime?: string;
    description?: string;
    id?: number;
    images?: string;
    isBuy?: number;
    isShelves?: number;
    price?: number;
    stock?: number;
    tags?: string[];
    title?: string;
    type?: string;
    updateTime?: string;
    userId?: number;
    userVO?: UserVO;
    viewsNum?: number;
  };

  type RegisterUserDto = {
    /** 家庭住址 */
    address?: string;
    /** 头像 */
    avatar?: string;
    /** 确认密码 */
    confirmPassword?: string;
    /** 个人简介 */
    description?: string;
    /** 邮箱 */
    email?: string;
    /** 手机号码 */
    mobile?: string;
    /** 昵称 */
    name?: string;
    /** 密码(加密) */
    password?: string;
    /** 性别 */
    sex?: string;
    /** 账号 */
    username?: string;
  };

  type ResetPasswordRequest = {
    code?: string;
    email?: string;
    newPassword?: string;
  };

  type ScoreCreateRequest = {
    /** 关联评分id */
    linkId?: number;
  };

  type ScoreUpdateRequest = {
    /** 评价 */
    appraisal?: string;
    /** id */
    id?: number;
    /** 分数 */
    score?: number;
  };

  type ScoreVO = {
    /** 评价 */
    appraisal?: string;
    /** 创建时间 */
    createTime?: string;
    /** id */
    id?: number;
    /** 关联评分id */
    linkId?: number;
    /** 评分用户VO */
    markUser?: UserVO;
    /** 评分用户 id */
    markUserId?: number;
    /** 分数 */
    score?: number;
    /** 关联文章 */
    task?: TaskVO;
    /** 更新时间 */
    updateTime?: string;
    /** 用户VO */
    user?: UserVO;
    /** 用户id */
    userId?: number;
  };

  type searchOrderBySearchTextUsingGETParams = {
    /** searchText */
    searchText?: string;
  };

  type searchPostBySearchTextUsingGETParams = {
    /** searchText */
    searchText?: string;
  };

  type searchProductBySearchTextUsingGETParams = {
    /** searchText */
    searchText?: string;
  };

  type SearchRequest = {
    searchText?: string;
  };

  type searchUsingPOST1Params = {
    /** searchText */
    searchText?: string;
  };

  type searchUsingPOSTParams = {
    /** query */
    query: string;
    /** stream */
    stream?: boolean;
  };

  type sendMessageUsingPOSTParams = {
    /** sessionId */
    sessionId: number;
  };

  type sendResetCodeForLoginUsingPOSTParams = {
    /** email */
    email: string;
  };

  type sendResetCodeForRegisterUsingPOSTParams = {
    /** email */
    email: string;
  };

  type sendResetCodeUsingPOSTParams = {
    /** email */
    email: string;
  };

  type TaskAddRequest = {
    endTime?: string;
    linkId?: number;
    principalId?: number;
    priority?: string;
    startTime?: string;
    status?: string;
    taskName?: string;
    userId?: number;
  };

  type TaskCategoryRequest = {
    ascending?: string;
    category?: string;
  };

  type TaskDataVO = {
    doingTaskCount?: number;
    finishTaskCount?: number;
    taskCount?: number;
    unFinishTaskCount?: number;
  };

  type TaskGetStatusRequest = {
    status?: string;
    userId?: number;
  };

  type TaskGetUserRequest = {
    userId?: number;
  };

  type TaskSearchRequest = {
    searchText?: string;
  };

  type TaskUpdateRequest = {
    endTime?: string;
    id?: number;
    linkId?: number;
    principalId?: number;
    priority?: string;
    progress?: number;
    startTime?: string;
    status?: string;
    taskName?: string;
    userId?: number;
  };

  type TaskVO = {
    createTime?: string;
    endTime?: string;
    id?: number;
    linkId?: number;
    post?: PostVO;
    principal?: UserVO;
    principalId?: number;
    priority?: string;
    progress?: number;
    startTime?: string;
    status?: string;
    taskName?: string;
    updateTime?: string;
    user?: UserVO;
    userId?: number;
  };

  type thumbPostUsingPOSTParams = {
    /** postId */
    postId: number;
  };

  type TokenDetails = {
    /** 接受的预测令牌数量 */
    accepted_prediction_tokens?: number;
    /** 推理令牌数量 */
    reasoning_tokens?: number;
    /** 拒绝的预测令牌数量 */
    rejected_prediction_tokens?: number;
  };

  type UpdateByAdminRequest = {
    /** 家庭住址 */
    address?: string;
    /** 头像 */
    avatar?: string;
    /** 个人简介 */
    description?: string;
    /** 邮箱 */
    email?: string;
    /** 手机号码 */
    mobile?: string;
    /** 昵称 */
    name?: string;
    /** 密码(加密) */
    password?: string;
    /** 角色 */
    role?: string;
    /** 性别 */
    sex?: string;
    /** 账号状态 #1：正常, 2：禁用 */
    status?: number;
    user_id?: number;
    /** 账号 */
    username?: string;
  };

  type UpdateByUserRequest = {
    /** 家庭住址 */
    address?: string;
    /** 头像 */
    avatar?: string;
    /** 个人简介 */
    description?: string;
    /** 邮箱 */
    email?: string;
    /** 手机号码 */
    mobile?: string;
    /** 昵称 */
    name?: string;
    /** 性别 */
    sex?: string;
    /** 用户id */
    user_id?: number;
    /** 账号 */
    username?: string;
  };

  type UpdateNoticeDto = {
    content?: string;
    end_time?: string;
    /** 通知id */
    notice_id?: number;
    sort?: number;
    start_time?: string;
    status?: number;
    title?: string;
    update_user?: string;
  };

  type UpdatePasswordRequest = {
    /** 确认新密码 */
    confirmPassword?: string;
    /** 新密码 */
    newPassword?: string;
    /** 旧密码 */
    oldPassword?: string;
    user_id?: number;
  };

  type uploadFileUsingPOSTParams = {
    biz?: string;
  };

  type Usage = {
    /** 完成令牌的数量 */
    completion_tokens?: number;
    /** 完成令牌的详细信息 */
    completion_tokens_details?: TokenDetails;
    /** 提示令牌的数量 */
    prompt_tokens?: number;
    /** 总令牌数 */
    total_tokens?: number;
  };

  type User = {
    /** 家庭住址 */
    address?: string;
    /** 头像 */
    avatar?: string;
    /** 创建时间 */
    createTime?: string;
    /** 个人简介 */
    description?: string;
    /** 邮箱 */
    email?: string;
    isDelete?: number;
    /** 手机号码 */
    mobile?: string;
    /** 昵称 */
    name?: string;
    /** 密码(加密) */
    password?: string;
    /** 角色 */
    role?: string;
    /** 性别 */
    sex?: string;
    /** 账号状态 #1：正常, 2：禁用 */
    status?: number;
    /** 更新时间 */
    updateTime?: string;
    /** 用户id */
    user_id?: number;
    /** 账号 */
    username?: string;
    /** vip到期时间 */
    vipEndTime?: string;
    /** vip开始时间 */
    vipStartTime?: string;
  };

  type UserVO = {
    /** 家庭住址 */
    address?: string;
    /** 头像 */
    avatar?: string;
    /** 创建时间 */
    createTime?: string;
    /** 个人简介 */
    description?: string;
    /** 邮箱 */
    email?: string;
    /** 是否vip */
    isVip?: number;
    /** 手机号码 */
    mobile?: string;
    /** 昵称 */
    name?: string;
    /** 角色 */
    role?: string;
    /** 性别 */
    sex?: string;
    /** 账号状态 #1：正常, 2：禁用 */
    status?: number;
    token?: string;
    /** 更新时间 */
    updateTime?: string;
    /** 用户id */
    user_id?: number;
    /** 账号 */
    username?: string;
    /** vip到期时间 */
    vipEndTime?: string;
    /** vip开始时间 */
    vipStartTime?: string;
  };

  type View = {
    contentType?: string;
  };

  type WebsiteVO = {
    contact_address?: string;
    contact_email?: string;
    contact_name?: string;
    contact_phone?: string;
    cover_url?: string;
    /** 网站特点描述 */
    features?: Feature[];
    footer_info?: string;
    id?: number;
    logo_url?: string;
    site_description?: string;
    site_name?: string;
    visit_count?: number;
  };
}
