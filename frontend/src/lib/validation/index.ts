import * as z from "zod";

const CustomFieldSchema = z.object({
    name: z.string(),
    type: z.string(),
    value: z.string(),
});
const CustomRepeaterFieldSchema = z.object({
    name: z.string(),
    type: z.string(),
    value: z.array(z.string()),
});
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
export const signUpValidationSchema = z.object({
    firstName: z.string().min(2, { message: "Too Short" }).max(50, 'Too big less than 50 character please'),
    lastName: z.string(),
    username: z.string().min(2, { message: "Too Short" }),
    email: z.string().min(1, { message: "Enter an Email" }).email({ message: "Enter valid email" }).nullable(),
    password: z.string().regex(passwordRegex, { message: "Password must contain at least one lowercase letter, one uppercase letter, and one number, and be at least 8 characters long" }),
})

export const signInValidationSchema = z.object({
    email: z.string().min(1, { message: "Enter an Email" }).email({ message: "Enter valid email" }).nullable(),
    password: z.string(),
    staySignedIn: z.string(),
    verification_code: z.string(),
    form_type: z.string(),
    recaptcha_key: z.optional(z.string())
})
export const loginInValidationSchema = z.object({
    email: z.string().min(1, { message: "Enter an Email" }).email({ message: "Enter valid email" }).nullable(),
    password: z.string().regex(passwordRegex, { message: "Password must contain at least one lowercase letter, one uppercase letter, and one number, and be at least 8 characters long" }),
    staySignedIn: z.string(),
    verification_code: z.string(),
    form_type: z.string(),
})

export const verifyAccount = z.object({
    email: z.string().min(1, { message: "Enter an Email" }).email({ message: "Enter valid email" }).nullable(),
    password: z.string(),
    staySignedIn: z.string(),
    verification_code: z.string().min(6, { message: "Verification Code must be of minimum 6 characters" }),
    form_type: z.string(),
})

export const forgotPassword = z.object({
    email: z.string().min(1, { message: "Enter an Email" }).email({ message: "Enter valid email" }).nullable(),
    password: z.string(),
    staySignedIn: z.string(),
    verification_code: z.string(),
    form_type: z.string(),
})

export const resetPasswordValidationSchema = z.object({
    password: z.string().regex(passwordRegex, { message: "Password must contain at least one lowercase letter, one uppercase letter, and one number, and be at least 8 characters long" }),
    confirm_password: z.string().min(8, { message: "Confirm Password must be of minimum 8 characters" }),
    reset_token: z.string(),
    form_type: z.string(),
    recaptcha_key: z.optional(z.string())
}).superRefine(({ confirm_password, password }, ctx) => {
    if (confirm_password !== password) {
        ctx.addIssue({
            code: "custom",
            path: ["confirm_password"],
            message: "The passwords did not match"
        });
    };
});

export const ProfileValidation = z.object({
    file: z.custom<File[]>(),
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    username: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email(),
    bio: z.string(),
});

export const categoryFormSchema = z.object({
    id: z.string(),
    description: z.string(),
    postType: z.string(),
    slug: z.string(),
    parentCategory: z.string().optional(),
    name: z.string(),

})
export const postValidationSchema = z.object({
    caption: z.string().min(3, { message: "Too Short" }).max(2000, 'Too big less than 50 character please'),
    location: z.string().min(3, { message: "Too Short" }).max(2000, 'Too big less than 50 character please'),
    file: z.custom<File[]>(),
    tags: z.string(),
})

export const PostFormSchema = z.object({
    id: z.string(),
    domain: z.string(),
    post_type: z.string(),
    title: z.string().min(1),
    content: z.string().min(1),
    featuredImage: z.string(),
    categories: z.array(z.string()),
    seoData: z.object({
        seoTitle: z.string().optional(),
        seoDescription: z.string().optional(),
        seoUrl: z.string().optional(),
        seoFilePath: z.string().optional(),
    }),
    customFields: z.array(CustomFieldSchema).optional(),
    customRepeaterFields: z.array(CustomRepeaterFieldSchema).optional(),
});

export const quickEditFormSchema = z.object({
    id: z.string(),
    title: z.string().min(1),
    slug: z.string(),
    status: z.string(),
    publicationDate: z.date(),
    sticky: z.boolean()

});

export const FieldSchema = z.object({
    name: z.string(),
    label: z.string(),
    variant: z.string(),
    field_type: z.string(),
    placeholder: z.string(),
});

export const CustomFormFieldSchema = z.object({
    id: z.string(),
    title: z.string(),
    post_type: z.string(),
    item_type: z.string(),
});

export const CustomFormFieldUpgradedSchema = z.object({
    id: z.string(),
    title: z.string().nonempty("Title is required"),
    item_type: z.string().nonempty("Item type is required"),
    post_type: z.string().nonempty("Post type is required"),
    customFields: z.array(
        z.object({
            groupTitle: z.string().nonempty("Group title is required"),
            groupDescription: z.string(),
            fields: z.array(
                z.object({
                    label: z.string().nonempty("Label is required"),
                    field_type: z.string().nonempty("Field type is required"),
                    variant: z.string().optional(),
                    placeholder: z.string().optional(),
                    required: z.boolean(),
                })
            ),
        })
    ),
});

export const editProfileFieldSchema = z.object({
    id: z.string(),
    name: z.string().min(3, { message: "Too Short" }).max(20).refine(value => value.length <= 20, {
        message: 'Too big, less than 20 characters please',
        path: ['name'],
    }),
    bio: z.string().optional(),
    profile_pic: z.string().or(z.optional(z.custom<File>())),
    email: z.string().min(1, { message: "Enter an Email" }).email({ message: "Enter valid email" }).nullable(),
    password: z.optional(z.string())
});

export const mediaEditFormSchema = z.object({
    id: z.string(),
    caption: z.string().min(0, { message: "Too Short" }).max(2000, 'Too big less than 50 character please'),
    alt_text: z.string().min(0, { message: "Too Short" }).max(2000, 'Too big less than 50 character please'),
    description: z.string().min(0, { message: "Too Short" }).max(2000, 'Too big less than 50 character please'),
    filename: z.string(),
    category: z.string(),
    tags: z.string(),
    title: z.string(),
})

const subNavItemSchema = z.object({
    id: z.string(),
    name: z.string().min(1, { message: "Too Short" }).max(50).refine(value => value.length <= 50, {
        message: 'Too big, less than 50 characters please',
        path: ['label'],
    }),
    route: z.string(),
    imgURL: z.string(),
});

export const navItemFormSchema = z.object({
    id: z.string(),
    route: z.string(),
    domain: z.string(),
    type: z.string(),
    place_after: z.string(),
    label: z.string().min(1, { message: "Too Short" }).max(50).refine(value => value.length <= 50, {
        message: 'Too big, less than 50 characters please',
        path: ['label'],
    }),
    enabled: z.boolean(),
    category: z.optional(z.string()),
    subcategory: z.array(subNavItemSchema),
});

export const commonNavSchema = z.object({
    id: z.optional(z.string()),
    route: z.string(),
    label: z.string().min(1, { message: "Too Short" }).max(50).refine(value => value.length <= 50, {
        message: 'Too big, less than 50 characters please',
        path: ['label'],
    }),
    subcategory: z.array(subNavItemSchema),

});

export const svgUploader = z.object({
    name: z.string().min(1, { message: "Too Short" }).max(12).refine(value => value.length <= 12, {
        message: 'Too big, less than 12 characters please',
        path: ['name'],
    }),
    code: z.string().min(50, { message: "Please enter valid Svg code" }),
});

// @ts-ignore
export const createOrEditUserSchema = z.object({
    id: z.optional(z.string()),
    name: z.string().min(3, { message: "Too Short" }).max(20).refine(value => value.length <= 20, {
        message: 'Too big, less than 20 characters please',
        path: ['name'],
    }),
    bio: z.optional(z.string()),
    profile_pic: z.string().or(z.optional(z.custom<File>())),
    email: z.string().min(1, { message: "Enter an Email" }).email({ message: "Enter valid email" }).nullable(),
    permissions: z.optional(z.any()),
    password: z.optional(z.string()),
    user_type:z.string()
});

export const createtUserSchema = z.object({
    id: z.optional(z.string()),
    name: z.string().min(3, { message: "Too Short" }).max(20).refine(value => value.length <= 20, {
        message: 'Too big, less than 20 characters please',
        path: ['name'],
    }),
    bio: z.optional(z.string()),
    profile_pic: z.string().or(z.optional(z.custom<File>())),
    email: z.string().min(1, { message: "Enter an Email" }).email({ message: "Enter valid email" }),
    permissions: z.optional(z.any()),
    password: z.optional(z.string()),
    user_type:z.string()

});

export const createOrEditWebsiteMenuSchema = z.object({
    id: z.string(),
    imgURL: z.string(),
    route: z.string(),
    label: z.string(),
    category: z.optional(z.string()),
    type: z.string(),
    place_after: z.string().optional()
});

export const createOrEditWebsiteSchema = z.object({
    id: z.string().optional(),
    icon: z.string().optional(),
    business_name: z.string().min(3, { message: "Too Short" }).max(20).refine(value => value.length <= 20, {
        message: 'Too big, less than 20 characters please',
        path: ['name'],
    }),
    url: z.string().refine((value) => /^(https?:\/\/[^\s/$.?#].[^\s]*\.(com|net|org|int|edu|gov|mil|co|info|biz|us|uk|jp|cn|de))$/.test(value), {
        message: "Invalid URL format. Ensure it starts with http or https and ends with a valid domain like .com, .net, .org, or other common TLDs.",
    }),
    description: z.string().optional(),
    menus: z.optional(z.array(z.object({
        id: z.string(),
        imgURL: z.string(),
        route: z.string(),
        label: z.string(),
        category: z.optional(z.string()),
        type: z.string(),
    }))),
    created_by: z.string().optional(),
});


