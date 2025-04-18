import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { PostModel } from "@/lib/types";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { usedeltePostbyID } from "@/lib/react-query/queriesAndMutations";
import SkeletonTable from "../skeletons/SkeletonTable";
import { useToast } from "../ui/use-toast";
import { confirmDialog } from "primereact/confirmdialog";
import { useUserContext } from "@/context/AuthProvider";
import { PreviewMode } from "@/components/shared/PreviewMode";
import { Eye } from "lucide-react";

import QuickEditForm from "@/plugin/post/_custom_form/QuickEditForm";
import SvgComponent from "@/utils/SvgComponent";
import { status } from "@/constants/message";
import { Badge } from "primereact/badge";
import { Dialog } from "primereact/dialog";
import WebView from "../shared/Webview";
import { getHeroIcon } from "@/lib/HeroIcon";

interface PostDataTableProps {
  posts: PostModel[];
  post_type: string;
  isPostLoading: boolean;
  setRerender: any;
  render: boolean;
  canEdit?: boolean;
  setChangeFilterCount?: any;
  setPosts?: any;
  setDeletedPostFilter?: any;
}

const PostDataTable: React.FC<PostDataTableProps> = ({
  isPostLoading,
  posts,
  post_type,
  setRerender,
  render,
  canEdit,
  setChangeFilterCount,
  setDeletedPostFilter,
}) => {
  const navigate = useNavigate();
  const { currentDomain } = useUserContext();

  const { toast } = useToast();

  const { mutateAsync: deletePostById, isPending: isDeleting } =
    usedeltePostbyID();
  const [expandedRows, setExpandedRows] = useState("");
  const [expandedQuickEditRows, setExpandedQuickEditRows] = useState("");
  const [isQuickEditForm, setIsQuickEditForm] = useState(false);
  const [rerenderPostTable, setRerenderPostTable] = useState(false);
  const [visible, setVisible] = useState(false);
  const [apiLogs, setApiLogs] = useState("all");
  const [selectedPost, setSelectedPost] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState<PostModel | null>(null);

  const [dataTablePosts, setDatatablePosts] = useState(posts);
  useEffect(() => {
    setDatatablePosts(posts); // Update dataTablePosts state when posts prop changes
  }, [posts]);
  useEffect(() => {
    // fetchCustomFields();
    if (expandedRows) {
      setIsQuickEditForm(false);
    }
    setRerender(!render);
    console.log(render, "CALLED");
  }, [rerenderPostTable]);

  const handleRowToggle = (rowData: PostModel) => {
    setExpandedRows(
      expandedRows === rowData.id
        ? rowData.id
        : (setIsQuickEditForm(false), rowData.id)
    );
  };

  const titleTemplate = (rowData: PostModel) => {
    return (
      <>
        <h6 className="text-sm">
          <div className="flex gap-4">
            {rowData.title}
            <Badge
              className="capitalize"
              value={rowData?.status}
              severity="info"
            ></Badge>
          </div>

          <div
            className={`about_section relative w-full ${expandedRows == rowData.id || expandedQuickEditRows == rowData.id
                ? "block"
                : "hidden"
              }`}
          >
            <table className="w-[100vw]">
              <tbody>
                <tr>
                  <td colSpan={100}>{rowExpansionTemplate(rowData)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </h6>
      </>
    );
  };

  const rowExpansionTemplate = (rowData: PostModel) => {
    let showQuickEditForm =
      isQuickEditForm || expandedQuickEditRows == rowData.id;
    return !showQuickEditForm ? (
      <div className="flex gap-2.5 mt-1">
        {canEdit && (
          <button
            className="border-none text-primary-500"
            onClick={() =>
              navigate(
                `/${btoa(currentDomain)}/post/${post_type}/${rowData?.id}`
              )
            }
          >
            Edit
          </button>
        )}
        {canEdit && (
          <button
            className="border-none text-primary-500"
            onClick={() => {
              setIsQuickEditForm(true);
              setExpandedQuickEditRows(rowData.id);
            }}
          >
            Quick edit
          </button>
        )}
        {canEdit && (
          <button
            className="border-none text-danger"
            onClick={() => confirmDelete(rowData.id, rowData.status)}
          >
            Trash
          </button>
        )}
        <button
          className="border-none text-primary-500"
          onClick={() => {
            setVisible(true);
            setApiLogs("single_post");
            setSelectedPost(rowData.id);
          }}
        >
          View
        </button>
        <button
          className="border-none text-primary-500 flex items-center gap-1"
          onClick={() => {
            setPreviewContent(rowData);
            setShowPreview(true);
          }}
        >
          <Eye className="h-4 w-4" />
          Preview
        </button>
      </div>
    ) : (
      <QuickEditForm
        setIsQuickEditForm={setIsQuickEditForm}
        rowData={rowData}
        setRerender={setRerenderPostTable}
        rerenderPostTable={rerenderPostTable}
        post_type={post_type}
        setExpandedQuickEditRows={setExpandedQuickEditRows}
      />
    );
  };

  const headerTemplate = () => {
    return (
      <div className={`flex items-center justify-between mb-6`}>
        <h1 className="page-innertitles">View API Request Log</h1>
        <button
          onClick={() => {
            setVisible(false);
          }}
        >
          <SvgComponent
            className="cursor-pointer float-right"
            svgName="close"
          />
        </button>
      </div>
    );
  };

  async function accept(post_id: string, setStatus: string) {
    const deleteMediaResponse = await deletePostById(post_id);
    if (!deleteMediaResponse)
      return toast({
        variant: "destructive",
        description: "You have cancelled the operations",
        duration: import.meta.env.VITE_TOAST_DURATION,
        icon: <SvgComponent className="" svgName="check_toaster" />,
      });
    if (deleteMediaResponse?.code == status.created) {
      let newPosts = posts.filter((post) => post.id !== post_id);
      setChangeFilterCount((prev: boolean) => !prev);
      setDatatablePosts(newPosts);
      setDeletedPostFilter(setStatus);
      return toast({
        variant: "default",
        description: deleteMediaResponse.data.message,
        duration: import.meta.env.VITE_TOAST_DURATION,
        icon: <SvgComponent className="" svgName="check_toaster" />,
      });
    } else {
      return toast({
        variant: "destructive",
        description: "You have cancelled the operations",
        duration: import.meta.env.VITE_TOAST_DURATION,
        icon: <SvgComponent className="" svgName="close_toaster" />,
      });
    }
  }

  const reject = () => {
    console.log("CACNELLEED");
  };
  const confirmDelete = (post_id: string, status: string) => {
    confirmDialog({
      header: "Are you sure you want to delete this post?",
      headerClassName: "font-inter text-[2rem]",
      acceptClassName: "accept_button",
      rejectClassName: "reject_button",
      className: "border bg-light-1 shadow-lg p-0 confirm_dialogue",
      accept: () => accept(post_id, status),
      acceptLabel: "Yes, remove it",
      rejectLabel: "Cancel",
      reject: reject,
      closeIcon: <SvgComponent className="" svgName="close" />,
      draggable: false,
    });
  };

  return (
    <div className="rounded-[1px] overflow-x-hidden w-full">
      {isPostLoading || isDeleting ? (
        <SkeletonTable rowCount={5} />
      ) : (
        <>
          <button
            className="rounded-md border mb-2 flex text-sm place-self-end border-primary-500 text-primary-500 py-2 px-4 absolute top-14 mt-2 right-8"
            onClick={() => {
              setVisible(true);
              setApiLogs("all");
            }}
          >
            {getHeroIcon('BarsArrowDownIcon')}
            View API
          </button>
          <DataTable
            value={dataTablePosts}
            tableStyle={{ minWidth: "60rem" }}
            frozenRow={true}
            tableClassName="table-fixed rounded-sm overflow-x-hidden" // @ts-ignore
            rowClassName={`odd:bg-light-gray cursor-pointer`} // @ts-ignore
            className="post_data_table table-fixed overflow-x-hidden" // @ts-ignore
            onRowMouseEnter={(e) => {
              // @ts-ignore
              handleRowToggle(e.data);
            }}
            onRowMouseLeave={() => {
              setExpandedRows("");
              console.log(isQuickEditForm, "TET");
            }}
          >
            <Column
              expander={true}
              field="title"
              header="Title"
              body={titleTemplate}
              className="text-sm font-medium"
            ></Column>
            <Column
              expander={true}
              field="categories"
              header="Seo Title"
              body={(rowData) =>
                `${rowData.seoData?.seoTitle?.trim()
                  ? rowData.seoData.seoTitle
                  : "N/A"
                }`
              }
              className="text-left text-sm font-medium"
            ></Column>
            <Column
              expander={true}
              field="id"
              header="Meta Desc"
              body={(rowData) =>
                rowData.seoData?.seoDescription?.trim()
                  ? rowData.seoData.seoDescription
                  : "N/A"
              }
              className="text-left text-sm font-medium"
            >
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 text-sm">
                Edit
              </button>
            </Column>
          </DataTable>
          <Dialog
            draggable={false}
            header={headerTemplate}
            closable={false}
            visible={visible}
            style={{ width: "70vw" }}
            onHide={() => setVisible(false)}
          >
            {apiLogs == "all" ? (
              <WebView
                apiKey="12345-ABCDE-67890-FGHIJ-KLMNO"
                postId={""}
                singlePost={false}
                website_name={currentDomain}
                post_type={post_type}
              />
            ) : (
              <WebView
                apiKey="12345-ABCDE-67890-FGHIJ-KLMNO"
                postId={selectedPost}
                singlePost={true}
              />
            )}
          </Dialog>
          {showPreview && previewContent && (
            <PreviewMode
              content={
                <div className="p-4">
                  <h2 className="text-2xl font-bold mb-4">{previewContent.title}</h2>
                  <div className="prose dark:prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: previewContent.content }} />
                  </div>
                </div>
              }
              onClose={() => {
                setShowPreview(false);
                setPreviewContent(null);
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default PostDataTable;
