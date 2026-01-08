package com.example.post.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostHashtagId implements Serializable {

    private Integer postId;
    private Integer hashtagId;
}
