// CategoryContext.tsx
import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';
import { CategoryKeyModel } from '@/lib/types';

type CategoryContextType = {
    categories: CategoryKeyModel[] | [];
    setCategories: Dispatch<SetStateAction<CategoryKeyModel[]>>;
    selectedCategory: CategoryKeyModel | any;
    setSelectedCategory: Dispatch<SetStateAction<CategoryKeyModel | null>>;
};

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [categories, setCategories] = useState<CategoryKeyModel[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<CategoryKeyModel | null>(null);

    return (
        <CategoryContext.Provider value={{ categories, setCategories, selectedCategory, setSelectedCategory }}>
            {children}
        </CategoryContext.Provider>
    );
};

export const useCategory = () => {
    const context = useContext(CategoryContext);
    if (!context) {
        throw new Error('useCategory must be used within a CategoryProvider');
    }
    return context;
};
